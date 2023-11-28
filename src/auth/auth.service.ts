import {Environment, JWTService, MailService, RedisxService} from '@/configs';
import {JWTPayload} from '@/configs/jwt/typedef';
import {
  CACHE_KEY,
  CACHE_KEY_TTL,
  HttpBadRequest,
  HttpForbidden,
  HttpInternalServerError,
  HttpUnauthorized,
  RoleEnum,
} from '@/core';
import {CreateUserDTO, StatusUser, UserEntity, UserService} from '@/modules/user';
import {Injectable} from '@nestjs/common';
import {isEmail, isPhoneNumber} from 'class-validator';
import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import {
  ChangePasswordDTO,
  ForgotPasswordDTO,
  ResetPasswordOtpDTO,
  SignInEmailDTO,
  SignInGoogleDTO,
  SignUpEmailDTO,
  VerifyEmailDTO,
  VerifyOtpDTO,
  VerifyPhoneDTO,
} from './dto';

interface AuthServiceInterface {
  signInEmailAndPassword(arg: SignInEmailDTO): Promise<any>;
  signUpEmailAndPassword(arg: SignUpEmailDTO): Promise<any>;
  signInWithGoogle(arg: SignInGoogleDTO): Promise<any>;
  signInWithFacebook(): Promise<any>;
  refreshToken(arg: string): Promise<any>;
  logOut(information: string): Promise<any>;
  forgotPassword(arg: ForgotPasswordDTO): Promise<any>;
  resetPasswordOtp(arg: ResetPasswordOtpDTO): Promise<any>;
  changePassword(arg: ChangePasswordDTO): Promise<any>;
  verifyEmail(arg: VerifyEmailDTO): Promise<any>;
  verifyPhone(arg: VerifyPhoneDTO): Promise<any>;
  verifyOtp(arg: VerifyOtpDTO): Promise<any>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisxService,
    private readonly jwtService: JWTService,
    private readonly mailService: MailService,
  ) {}

  async signInEmailAndPassword(arg: SignInEmailDTO): Promise<any> {
    try {
      const {email, password, deviceToken, deviceType} = arg;

      const user: UserEntity = await this.userService.findForAuth(email);

      if (!user) return new HttpForbidden('User not found');

      const userEntity = new UserEntity(user);

      const isMatchPassword = await userEntity.validatePassword(password);

      if (!isMatchPassword) return new HttpUnauthorized('Password not match');

      const payload: JWTPayload = {
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: user.email,
        uuid: user.uuid,
        role: user.role,
      };

      const accessToken = await this.jwtService.signToken(payload, 'accessToken');

      const refreshToken = await this.jwtService.signToken(payload, 'refreshToken');

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async signUpEmailAndPassword(arg: SignUpEmailDTO): Promise<any> {
    try {
      const {deviceToken, deviceType, email, password, firstName, lastName} = arg;

      const user: UserEntity = await this.userService.findForAuth(email);

      if (user) return new HttpBadRequest('User already exists');

      const createUserDTO: CreateUserDTO = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
      };

      const newUser: UserEntity = await this.userService.createUser(createUserDTO);

      const payload: JWTPayload = {
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: newUser.email,
        uuid: newUser.uuid,
        role: RoleEnum.USER,
      };

      const accessToken = await this.jwtService.signToken(payload, 'accessToken');

      const refreshToken = await this.jwtService.signToken(payload, 'refreshToken');

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async signInWithGoogle(signInGoogleDTO: SignInGoogleDTO): Promise<any> {
    try {
      const {deviceToken, deviceType, idToken} = signInGoogleDTO;

      const client: OAuth2Client = new OAuth2Client(Environment.GOOGLE_CLIENT_ID);

      const ticker: LoginTicket = await client.verifyIdToken({
        idToken: idToken,
        audience: Environment.GOOGLE_CLIENT_ID,
        maxExpiry: 1000 * 60 * 60 * 24 * 7,
      });

      const payload: TokenPayload = ticker.getPayload();

      return null;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async signInWithFacebook(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async refreshToken(arg: string): Promise<any> {
    try {
      const payload: JWTPayload = await this.jwtService.verifyToken(arg, 'refreshToken');

      const user: UserEntity = await this.userService.findForAuth(payload.email);

      const newPayload: JWTPayload = {
        email: user.email,
        role: user.role,
        deviceToken: user.deviceToken,
        deviceType: user.deviceType,
        uuid: user.uuid,
      };

      const accessToken = await this.jwtService.signToken(newPayload, 'accessToken');

      const refreshToken = await this.jwtService.signToken(newPayload, 'refreshToken');

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async logOut(information: string): Promise<any> {
    try {
      await this.redisService.delKey(`${CACHE_KEY.user}:${information}`);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<any> {
    try {
      const {email} = forgotPasswordDTO;

      const user: UserEntity = await this.userService.findForAuth(email);

      if (!user) return new HttpForbidden('User not found');

      let code = Math.floor(100000 + Math.random() * 900000).toString();

      await this.redisService.delKey(`${CACHE_KEY.verifyAuthOTP}:${email}`);

      await this.redisService.setKey(`${CACHE_KEY.verifyAuthOTP}:${email}`, code, CACHE_KEY_TTL.verifyAuthOTP);

      await this.mailService.sendUserResetPasswordOtp(`${user.firstName} ${user.lastName}`, email, code);

      return 'OTP sent to your email, you have 5 minutes to reset password !!!';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async resetPasswordOtp(resetPasswordOtpDTO: ResetPasswordOtpDTO): Promise<any> {
    try {
      const {email, password, otp} = resetPasswordOtpDTO;

      const user: UserEntity = await this.userService.findForAuth(email);

      if (!user) return new HttpForbidden('User not found');

      const isMatchCode = await this.redisService.getKey(`${CACHE_KEY.verifyAuthOTP}:${email}`);

      if (!isMatchCode) return new HttpBadRequest('Request invalid or expired !!!');

      if (isMatchCode.toString() !== otp.toString())
        return new HttpBadRequest('OTP not match !!!, please try again !!!');

      await this.userService.updateUserPassword(user.uuid, password);

      await this.redisService.delKey(`${CACHE_KEY.verifyAuthOTP}:${email}`);

      return 'Reset password successfully, please login again !!!';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async changePassword(arg: ChangePasswordDTO): Promise<any> {
    try {
      const {email, password} = arg;

      const user: UserEntity = await this.userService.findForAuth(email);

      if (!user) return new HttpForbidden('User not found');

      await this.userService.updateUserPassword(user.uuid, password);

      await this.redisService.delKey(`${CACHE_KEY.user}:${user.uuid}`);

      await this.mailService.sendUserResetPasswordSuccess(`${user.firstName} ${user.lastName}`, email);

      return 'Change password successfully !!!, please login again !!!';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async verifyEmail(arg: VerifyEmailDTO): Promise<any> {
    try {
      const {email} = arg;

      const user: UserEntity = await this.userService.findForAuth(email);

      if (!user) return new HttpForbidden('User not found');

      if (user.status === StatusUser.ACTIVE) return new HttpBadRequest('User already verified !!!');

      let code = Math.floor(100000 + Math.random() * 900000).toString();

      await this.redisService.delKey(`${CACHE_KEY.verifyOtp}:${email}`);

      await this.redisService.setKey(`${CACHE_KEY.verifyOtp}:${email}`, code, CACHE_KEY_TTL.verifyOtp);

      await this.mailService.sendUserVerifyCode(`${user.firstName} ${user.lastName}`, email, code);

      return 'OTP sent to your email, you have 5 minutes to verify !!!';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async verifyPhone(arg: VerifyPhoneDTO): Promise<any> {
    try {
      const {phone} = arg;

      const user: UserEntity = await this.userService.findByPhone(phone);

      delete user.hashPassword;
      delete user.salt;

      if (!user) return new HttpForbidden('User not found');

      let code = Math.floor(100000 + Math.random() * 900000).toString();

      await this.redisService.delKey(`${CACHE_KEY.verifyOtp}:${phone}`);

      await this.redisService.setKey(`${CACHE_KEY.verifyOtp}:${phone}`, code, CACHE_KEY_TTL.verifyOtp);

      // TODO: send sms

      return 'OTP sent to your phone, you have 5 minutes to verify !!!';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async verifyOtp(arg: VerifyOtpDTO): Promise<any> {
    try {
      const {otp, information} = arg;

      var user: UserEntity;

      if (isPhoneNumber(information)) {
        user = await this.userService.findByPhone(information);
        delete user.hashPassword;
        delete user.salt;
      } else if (isEmail(information)) {
        user = await this.userService.findForAuth(information);
      } else {
        return new HttpBadRequest('Information invalid !!!');
      }

      if (!user) return new HttpForbidden('User not found');

      const isMatchCode = await this.redisService.getKey(`${CACHE_KEY.verifyOtp}:${information}`);

      if (!isMatchCode) return new HttpBadRequest('Request invalid or expired !!!');

      if (isMatchCode.toString() !== otp.toString())
        return new HttpBadRequest('OTP not match !!!, please try again !!!');

      await this.userService.updateUserStatus(user.uuid, StatusUser.ACTIVE);

      await this.redisService.delKey(`${CACHE_KEY.verifyOtp}:${information}`);

      return 'Verify successfully !!!';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
