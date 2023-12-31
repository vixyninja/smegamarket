import {Environment, JWTPayload, JWTService} from '@/configs';
import {HttpBadRequest, RoleEnum, SpeakeasyUtil} from '@/core';
import {I18nTranslations} from '@/i18n/generated/i18n.generated';
import {CreateUserDTO, UserEntity, UserMailService, UserService} from '@/modules/user';
import {Injectable} from '@nestjs/common';
import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import {I18nContext, I18nService} from 'nestjs-i18n';
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
} from '../dtos';
import {IAuthService} from '../interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userMailService: UserMailService,
    private readonly jwtService: JWTService,
  ) {}

  async forgotPassword(arg: ForgotPasswordDTO): Promise<any> {
    try {
      const {email} = arg;

      const user: UserEntity = await this.userService.readUserForAuth(email);

      if (!user) {
        throw new HttpBadRequest(
          "We can't find a user with that e-mail address. Please make sure you have entered the right e-mail address.",
        );
      }

      const secret: string = SpeakeasyUtil.generateSecret();

      const otp: string = SpeakeasyUtil.generateToken(secret);

      if (!otp) {
        throw new HttpBadRequest(
          "We can't generate otp for that user. Please make sure you have entered the right e-mail address.",
        );
      }

      const result = await this.userMailService.sendUserResetPasswordOtp(user.firstName, user.email, otp);

      return result;
    } catch (e) {
      throw e;
    }
  }
  sendOtpResetPassword(arg: ResetPasswordOtpDTO): Promise<any> {
    throw new Error('Method not implemented.');
  }
  changePassword(arg: ChangePasswordDTO): Promise<any> {
    throw new Error('Method not implemented.');
  }
  sendOtpEmail(arg: VerifyEmailDTO): Promise<any> {
    throw new Error('Method not implemented.');
  }
  sendOtpPhone(arg: VerifyPhoneDTO): Promise<any> {
    throw new Error('Method not implemented.');
  }
  verifyEmailOrPhone(arg: VerifyOtpDTO): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async signInEmailAndPassword(
    args: SignInEmailDTO,
  ): Promise<{accessToken: string; refreshToken: string; user: Omit<UserEntity, 'password' | 'salt'>}> {
    try {
      const {email, password, deviceToken, deviceType} = args;
      const user: UserEntity = await this.userService.readUserForAuth(email);

      if (!user) {
        throw new HttpBadRequest(
          "We can't find a user with that e-mail address. Please make sure you have entered the right e-mail address.",
        );
      }

      const isMatch: boolean = await user.comparePassword(password);
      if (!isMatch) {
        throw new HttpBadRequest(
          "We can't find a user with that e-mail address. Please make sure you have entered the right e-mail address.",
        );
      }
      const payloadJWT: JWTPayload = {
        uuid: user.uuid,
        role: user.role,
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: user.email,
      };

      const [accessToken, refreshToken] = await Promise.all([
        await this.jwtService.signToken(payloadJWT, 'accessToken'),
        await this.jwtService.signToken(payloadJWT, 'refreshToken'),
      ]);

      const userInfo = await this.userService.readUser(user.uuid);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: userInfo,
      };
    } catch (e) {
      throw e;
    }
  }

  async signUpEmailAndPassword(args: SignUpEmailDTO): Promise<{
    accessToken: string;
    refreshToken: string;
    user: Omit<UserEntity, 'password' | 'salt'>;
  }> {
    try {
      const {email, deviceToken, deviceType, ...props} = args;

      const existUser = await this.userService.readUserForCreate(email);

      if (existUser) {
        throw new HttpBadRequest(
          'User with that e-mail address already exists. Please make sure you have entered the right e-mail address.',
        );
      }

      const user = await this.userService.createUser(args);

      if (!user) {
        throw new HttpBadRequest(
          'We can not create user with that e-mail address. Please make sure you have entered the right e-mail address.',
        );
      }

      const payloadJWT: JWTPayload = {
        uuid: user.uuid,
        role: user.role,
        deviceToken: deviceToken,
        deviceType: deviceType,
        email: user.email,
      };

      const [accessToken, refreshToken] = await Promise.all([
        await this.jwtService.signToken(payloadJWT, 'accessToken'),
        await this.jwtService.signToken(payloadJWT, 'refreshToken'),
      ]);

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: user,
      };
    } catch (e) {
      throw e;
    }
  }

  async signInWithGoogle(args: SignInGoogleDTO): Promise<any> {
    try {
      const {idToken, deviceToken, deviceType} = args;

      const client: OAuth2Client = new OAuth2Client(Environment.GOOGLE_CLIENT_ID);
      const ticker: LoginTicket = await client.verifyIdToken({
        idToken: idToken,
        audience: Environment.GOOGLE_CLIENT_ID,
        maxExpiry: 1000 * 60 * 60 * 24 * 7,
      });

      const payload: TokenPayload = ticker.getPayload();
      const existUser: UserEntity = await this.userService.readUserForAuth(payload.email);

      if (existUser) {
        const jwtPayLoad: JWTPayload = {
          deviceToken: deviceToken,
          deviceType: deviceType,
          email: existUser.email,
          uuid: existUser.uuid,
          role: existUser.role,
        };
        const [accessToken, refreshToken] = await Promise.all([
          await this.jwtService.signToken(jwtPayLoad, 'accessToken'),
          await this.jwtService.signToken(jwtPayLoad, 'refreshToken'),
        ]);
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
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
        const [accessToken, refreshToken] = await Promise.all([
          await this.jwtService.signToken(jwtPayLoad, 'accessToken'),
          await this.jwtService.signToken(jwtPayLoad, 'refreshToken'),
        ]);
        return {
          accessToken: accessToken,
          refreshToken: refreshToken,
          user: newUser,
        };
      }
    } catch (e) {
      throw e;
    }
  }

  signInWithFacebook(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  async refreshToken(refreshToken: string): Promise<{accessToken: string; refreshToken: string}> {
    try {
      const payload: JWTPayload = await this.jwtService.verifyToken(refreshToken, 'refreshToken');

      const [newAccessToken, newRefreshToken] = await Promise.all([
        await this.jwtService.signToken(payload, 'accessToken'),
        await this.jwtService.signToken(payload, 'refreshToken'),
      ]);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      throw e;
    }
  }
}
