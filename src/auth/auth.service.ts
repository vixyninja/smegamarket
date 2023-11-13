import {Environment, JWTService, MailService, RedisxService} from '@/configs';
import {JWTPayload} from '@/configs/jwt/typedef';
import {HttpBadRequest, RoleEnum} from '@/core';
import {CreateUserDTO, UserEntity, UserService} from '@/modules/user';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import {Repository} from 'typeorm';
import {
  ForgotPasswordDTO,
  ResetPasswordOtpDTO,
  SignInEmailDTO,
  SignInGoogleDTO,
  SignOutEmailDTO,
  SignUpEmailDTO,
} from './dto';

const secret = 'verify-otp';

interface AuthServiceInterface {
  signInGoogle(signInGoogleDTO: SignInGoogleDTO): Promise<any>;
  signInFacebook(): Promise<any>;
  signUpEmailAndPassword(signUpEmailDTO: SignUpEmailDTO): Promise<any>;
  signInEmailAndPassword(signInEmailDTO: SignInEmailDTO): Promise<any>;
  signOut(signOutEmailDTO: SignOutEmailDTO): Promise<any>;
  forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<any>;
  resetPasswordOtp(resetPasswordOtpDTO: ResetPasswordOtpDTO): Promise<any>;
}

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly redisService: RedisxService,
    private readonly jwtService: JWTService,
    private readonly mailService: MailService,
  ) {}

  async signInGoogle(signInGoogleDTO: SignInGoogleDTO): Promise<any> {
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
      throw new HttpBadRequest(e.message);
    }
  }
  signInFacebook(): Promise<any> {
    throw new Error('Method not implemented.');
  }
  async signUpEmailAndPassword(signUpEmailDTO: SignUpEmailDTO): Promise<any> {
    try {
      const {deviceToken, deviceType, email, password, firstName, lastName} = signUpEmailDTO;
      const user: UserEntity = await this.userService.findByEmail(email);
      if (user) return new HttpBadRequest('Email already exists');
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
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async signInEmailAndPassword(signInEmailDTO: SignInEmailDTO): Promise<any> {
    try {
      const {email, password, deviceToken, deviceType} = signInEmailDTO;
      const user: UserEntity = await this.userService.findByEmail(email);
      if (!user) return new HttpBadRequest('Email not found');
      const payload: JWTPayload = {
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: user.email,
        uuid: user.uuid,
        role: user.role,
      };
      const isMatchPassword = await user.validatePassword(password);

      if (!isMatchPassword) return new HttpBadRequest('Password not match');
      const accessToken = await this.jwtService.signToken(payload, 'accessToken');
      const refreshToken = await this.jwtService.signToken(payload, 'refreshToken');
      return {
        message: 'Login successfully !!!',
        data: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async signOut(signOutEmailDTO: SignOutEmailDTO): Promise<any> {
    try {
      const {uuid} = signOutEmailDTO;
      await this.redisService.delKey(uuid);
      return {
        message: 'Sign out successfully !!!',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async forgotPassword(forgotPasswordDTO: ForgotPasswordDTO): Promise<any> {
    try {
      const {email} = forgotPasswordDTO;
      const user: UserEntity = await this.userService.findByEmail(email);
      if (!user) return new HttpBadRequest('Email not found');
      let code = Math.floor(Math.random() * 1000000).toString();
      await this.redisService.delKey(email + secret);
      await this.redisService.setKey(email + secret, code);
      await this.mailService.sendUserResetPassword(user.firstName + ' ' + user.lastName, email, code);
      return {
        message: 'Forgot password successfully !!!',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async resetPasswordOtp(resetPasswordOtpDTO: ResetPasswordOtpDTO): Promise<any> {
    try {
      const {email, password, code} = resetPasswordOtpDTO;
      const user: UserEntity = await this.userService.findByEmail(email);
      if (!user) return new HttpBadRequest('Email not found');
      const isMatchCode = await this.redisService.getKey(email + secret);
      if (!isMatchCode) return new HttpBadRequest('Request not found');
      if (JSON.stringify(isMatchCode.toString()) === code.toString()) return new HttpBadRequest('Code not match');
      await this.userService.updateUserPassword(user.uuid, password);
      await this.redisService.delKey(email + secret);
      return {
        message: 'Reset password successfully !!!',
      };
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
