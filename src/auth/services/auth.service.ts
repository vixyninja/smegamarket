import {Environment, JWTService, RedisxService} from '@/configs';
import {JWTPayload} from '@/configs/jwt/typedef';
import {
  CACHE_KEY,
  CACHE_KEY_TTL,
  HttpBadRequest,
  HttpForbidden,
  HttpInternalServerError,
  HttpNotFound,
  HttpUnauthorized,
  RoleEnum,
  randomOTP,
} from '@/core';
import {CreateUserDTO, StatusUser, UserEntity, UserMailService, UserService} from '@/modules/user';
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
} from '../dto';
import {IAuthService} from '../interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userMailService: UserMailService,
    private readonly redisService: RedisxService,
    private readonly jwtService: JWTService,
  ) {}

  async signInEmailAndPassword(arg: SignInEmailDTO): Promise<any> {
    try {
      const {email, password, deviceToken, deviceType} = arg;
      const user: UserEntity = await this.userService.findForAuth(email);
      if (!user) return new HttpNotFound('User not found');

      const userEntity = new UserEntity(user);
      const isMatchPassword = await userEntity.validatePassword(password);
      if (!isMatchPassword) return new HttpUnauthorized("Password doesn't match");

      const payload: JWTPayload = {
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: user.email,
        uuid: user.uuid,
        role: user.role,
      };
      const token = await Promise.all([
        await this.jwtService.signToken(payload, 'accessToken'),
        await this.jwtService.signToken(payload, 'refreshToken'),
      ]);

      return {
        accessToken: token[0],
        refreshToken: token[1],
        user: user,
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
        deviceToken: deviceToken,
        deviceType: deviceType,
      };
      const newUser: UserEntity = await this.userService.createUser(createUserDTO);

      const payload: JWTPayload = {
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: newUser.email,
        uuid: newUser.uuid,
        role: RoleEnum.USER,
      };
      const token = await Promise.all([
        await this.jwtService.signToken(payload, 'accessToken'),
        await this.jwtService.signToken(payload, 'refreshToken'),
      ]);

      return {
        accessToken: token[0],
        refreshToken: token[1],
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
      const existUser: UserEntity = await this.userService.findForAuth(payload.email);
      if (existUser) {
        const jwtPayLoad: JWTPayload = {
          deviceToken: deviceToken,
          deviceType: deviceType,
          email: existUser.email,
          uuid: existUser.uuid,
          role: existUser.role,
        };
        const token = await Promise.all([
          await this.jwtService.signToken(jwtPayLoad, 'accessToken'),
          await this.jwtService.signToken(jwtPayLoad, 'refreshToken'),
        ]);
        return {
          accessToken: token[0],
          refreshToken: token[1],
          user: existUser,
        };
      } else {
        const createUserDTO: CreateUserDTO = {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          password: payload.sub,
          deviceToken: deviceToken,
          deviceType: deviceType,
        };
        const newUser: UserEntity = await this.userService.createUser(createUserDTO);
        const jwtPayLoad: JWTPayload = {
          deviceToken: deviceToken,
          deviceType: deviceType,
          email: newUser.email,
          uuid: newUser.uuid,
          role: RoleEnum.USER,
        };
        const token = await Promise.all([
          await this.jwtService.signToken(jwtPayLoad, 'accessToken'),
          await this.jwtService.signToken(jwtPayLoad, 'refreshToken'),
        ]);
        return {
          accessToken: token[0],
          refreshToken: token[1],
          user: newUser,
        };
      }
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

      const token = await Promise.all([
        await this.jwtService.signToken(newPayload, 'accessToken'),
        await this.jwtService.signToken(newPayload, 'refreshToken'),
      ]);
      return {
        accessToken: token[0],
        refreshToken: token[1],
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async logOut(information: string): Promise<any> {
    try {
      await this.redisService.delKey(`${CACHE_KEY.USER}:${information}`);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<any> {
    try {
      const {email} = forgotPasswordDTO;
      const user: UserEntity = await this.userService.findForAuth(email);
      if (!user) return new HttpForbidden('User not found');

      await this.redisService.delKey(`${CACHE_KEY.VERIFY_FORGOT_PASSWORD}:${email}`);

      let code = randomOTP();
      await this.redisService.setKey(
        `${CACHE_KEY.VERIFY_FORGOT_PASSWORD}:${email}`,
        code,
        CACHE_KEY_TTL.VERIFY_FORGOT_PASSWORD,
      );

      const result = await this.userMailService.sendUserResetPasswordOtp(
        `${user.firstName} ${user.lastName}`,
        email,
        code,
      );

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async resetPasswordOtp(resetPasswordOtpDTO: ResetPasswordOtpDTO): Promise<any> {
    try {
      const {email, password, otp} = resetPasswordOtpDTO;
      const user: UserEntity = await this.userService.findForAuth(email);
      if (!user) return new HttpForbidden('User not found');

      const isMatchCode = await this.redisService.getKey(`${CACHE_KEY.VERIFY_FORGOT_PASSWORD}:${email}`);
      if (!isMatchCode) return new HttpBadRequest('Request invalid or expired !!!');
      if (isMatchCode.toString() !== otp.toString())
        return new HttpBadRequest('OTP not match !!!, please try again !!!');

      await this.userService.updateUserPassword(user.uuid, password);
      await this.redisService.delKey(`${CACHE_KEY.VERIFY_FORGOT_PASSWORD}:${email}`);
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
      await this.redisService.delKey(`${CACHE_KEY.USER}:${user.uuid}`);

      const result = await this.userMailService.sendUserResetPasswordSuccess(
        `${user.firstName} ${user.lastName}`,
        email,
      );
      return result;
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

      await this.redisService.delKey(`${CACHE_KEY.VERIFY_EMAIL}:${email}`);
      let code = randomOTP();
      await this.redisService.setKey(`${CACHE_KEY.VERIFY_EMAIL}:${email}`, code, CACHE_KEY_TTL.VERIFY_EMAIL);

      const result = await this.userMailService.sendUserVerifyCode(`${user.firstName} ${user.lastName}`, email, code);
      return result;
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

      let code = randomOTP();
      await this.redisService.delKey(`${CACHE_KEY.VERIFY_PHONE}:${phone}`);
      await this.redisService.setKey(`${CACHE_KEY.VERIFY_PHONE}:${phone}`, code, CACHE_KEY_TTL.VERIFY_PHONE);

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

        if (!user) return new HttpForbidden('User not found');

        delete user.hashPassword;
        delete user.salt;

        const isMatchCode = await this.redisService.getKey(`${CACHE_KEY.VERIFY_PHONE}:${information}`);
        if (!isMatchCode) return new HttpBadRequest('Request invalid or expired !!!');
        if (isMatchCode.toString() !== otp.toString())
          return new HttpBadRequest('OTP not match !!!, please try again !!!');

        await this.userService.updateUserStatus(user.uuid, StatusUser.ACTIVE);
        await this.redisService.delKey(`${CACHE_KEY.VERIFY_PHONE}:${information}`);
        return 'Verify successfully !!!';
      } else if (isEmail(information)) {
        user = await this.userService.findForAuth(information);

        if (!user) return new HttpForbidden('User not found');

        delete user.hashPassword;
        delete user.salt;

        const isMatchCode = await this.redisService.getKey(`${CACHE_KEY.VERIFY_EMAIL}:${information}`);
        if (!isMatchCode) return new HttpBadRequest('Request invalid or expired !!!');
        if (isMatchCode.toString() !== otp.toString())
          return new HttpBadRequest('OTP not match !!!, please try again !!!');

        await this.userService.updateUserStatus(user.uuid, StatusUser.ACTIVE);
        await this.redisService.delKey(`${CACHE_KEY.VERIFY_EMAIL}:${information}`);
        return 'Verify successfully !!!';
      } else {
        return new HttpBadRequest('Information invalid !!!');
      }
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
