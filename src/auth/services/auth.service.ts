import {Environment, JWTPayload, JWTService} from '@/configs';
import {HttpBadRequest, RoleEnum, SpeakeasyUtil} from '@/core';
import {CreateUserDTO, StatusUser, UserEntity, UserMailService, UserService} from '@/modules';
import {Injectable} from '@nestjs/common';
import {LoginTicket, OAuth2Client, TokenPayload} from 'google-auth-library';
import {adjectives, names, starWars, uniqueNamesGenerator} from 'unique-names-generator';
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
import {IAuthResponse, IAuthService} from '../interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userMailService: UserMailService,
    private readonly jwtService: JWTService,
  ) {}

  async signInEmailAndPassword(args: SignInEmailDTO): Promise<IAuthResponse> {
    try {
      const {email, password, deviceToken} = args;
      const user: UserEntity = await this.userService.readUserForAuth(email);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right e-mail address.');
      }

      const isMatch: boolean = await user.comparePassword(password);
      if (!isMatch) {
        throw new HttpBadRequest('Password is incorrect. Please make sure you have entered the right password.');
      }
      const payloadJWT: JWTPayload = {
        uuid: user.uuid,
        role: user.role,
        deviceToken: deviceToken,
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

  async signUpEmailAndPassword(args: SignUpEmailDTO): Promise<IAuthResponse> {
    try {
      const {email, deviceToken, ...props} = args;

      const existUser = await this.userService.readUserForCreate(email);

      if (existUser) {
        throw new HttpBadRequest(
          'User already exists. Please choose another e-mail address or sign in with your account.',
        );
      }

      const randName: string = uniqueNamesGenerator({
        dictionaries: [names, starWars, adjectives],
        length: 2,
        seed: Math.floor(Math.random() * 1000000),
        separator: ' ',
        style: 'capital',
      });

      const firstName: string = randName.split(' ')[0];
      const lastName: string = randName.split(' ')[1];

      const twoFactorTempSecret: string = SpeakeasyUtil.generateSecret();

      const createUser = await this.userService.createUser({
        email: email,
        deviceToken: deviceToken,
        firstName: firstName,
        lastName: lastName,
        password: props.password,
        twoFactorTempSecret: twoFactorTempSecret,
      });

      if (!createUser) {
        throw new HttpBadRequest("User can't create. Please make sure you have entered the right information.");
      }

      const user: UserEntity = await this.userService.readUser(createUser.uuid);

      if (!user) throw new HttpBadRequest('User not found. Please make sure you have entered the right information.');

      const payloadJWT: JWTPayload = {
        uuid: user.uuid,
        role: user.role,
        deviceToken: deviceToken,
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

  async signInWithGoogle(args: SignInGoogleDTO): Promise<IAuthResponse> {
    try {
      const {idToken, deviceToken} = args;

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
        const twoFactorTempSecret: string = SpeakeasyUtil.generateSecret();

        const createUserDTO: CreateUserDTO = {
          email: payload.email,
          firstName: payload.given_name,
          lastName: payload.family_name,
          password: payload.sub,
          deviceToken: deviceToken,
          twoFactorTempSecret: twoFactorTempSecret,
        };

        const newUser: UserEntity = await this.userService.createUser(createUserDTO);

        const jwtPayLoad: JWTPayload = {
          deviceToken: deviceToken,
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

  async refreshToken(refreshToken: string): Promise<{accessToken: string; refreshToken: string}> {
    try {
      const decodePayload: JWTPayload = await this.jwtService.verifyToken(refreshToken, 'refreshToken');

      const payload: JWTPayload = {
        uuid: decodePayload.uuid,
        role: decodePayload.role,
        deviceToken: decodePayload.deviceToken,
        email: decodePayload.email,
      };

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

  async forgotPassword(arg: ForgotPasswordDTO): Promise<any> {
    try {
      const {email} = arg;

      const user: UserEntity = await this.userService.readUserForAuth(email);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right e-mail address.');
      }

      const otp: string = SpeakeasyUtil.generateToken(user.twoFactorTempSecret);
      if (!otp) throw new HttpBadRequest('OTP has error. Please contact to admin for more information.');

      const result = await this.userMailService.sendUserResetPasswordOtp(user.firstName, user.email, otp);

      return result;
    } catch (e) {
      throw e;
    }
  }

  async verifyOtpResetPassword(arg: ResetPasswordOtpDTO): Promise<UserEntity> {
    try {
      const {password, email, confirmPassword, otp} = arg;

      if (password !== confirmPassword) throw new HttpBadRequest('Password and Confirm Password are not match.');

      const user: UserEntity = await this.userService.readUserForAuth(email);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right e-mail address.');
      }

      // verify otp
      const isValid: boolean = SpeakeasyUtil.verifyToken(user.twoFactorTempSecret, otp.toString());
      if (!isValid) throw new HttpBadRequest('OTP is invalid. Please make sure you have entered the right OTP.');

      if (password !== confirmPassword) throw new HttpBadRequest('Password and Confirm Password are not match.');

      const updatedUser = await this.userService.updateUserPassword(user.uuid, password);
      if (!updatedUser) throw new HttpBadRequest("Can't update password");

      const userUpdated = await this.userService.readUser(updatedUser.uuid);

      return userUpdated;
    } catch (e) {
      throw e;
    }
  }

  async sendOtpEmail(arg: VerifyEmailDTO): Promise<any> {
    try {
      const {email} = arg;

      const user: UserEntity = await this.userService.readUserForInformation(email);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right e-mail address.');
      }

      // send otp to email
      const otp: string = SpeakeasyUtil.generateToken(user.twoFactorTempSecret);
      if (!otp) throw new HttpBadRequest('OTP has error. Please contact to admin for more information.');

      const result = await this.userMailService.sendUserVerifyCode(user.firstName, user.email, otp);

      return result;
    } catch (e) {
      throw e;
    }
  }

  async sendOtpPhone(arg: VerifyPhoneDTO): Promise<any> {
    try {
      const {phone} = arg;

      const user: UserEntity = await this.userService.readUserForInformation(phone);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right phone number.');
      }

      // send otp to phone number
      const otp: string = SpeakeasyUtil.generateToken(user.twoFactorTempSecret);
      if (!otp) throw new HttpBadRequest('OTP has error. Please contact to admin for more information.');

      const result = await this.userMailService.sendUserVerifyCode(user.firstName, user.email, otp);

      return result;
    } catch (e) {
      throw e;
    }
  }

  async verifyEmailOrPhone(arg: VerifyOtpDTO): Promise<UserEntity> {
    try {
      const {information, otp} = arg;

      const user: UserEntity = await this.userService.readUserForInformation(information);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right information.');
      }

      // verify otp
      const isValid: boolean = SpeakeasyUtil.verifyToken(user.twoFactorTempSecret, otp.toString());
      if (!isValid) throw new HttpBadRequest('OTP is invalid. Please make sure you have entered the right OTP.');

      const updatedUser = await this.userService.updateUserStatus(user.uuid, StatusUser.ACTIVE);
      if (!updatedUser) throw new HttpBadRequest("Can't update status");

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async changePassword(arg: ChangePasswordDTO): Promise<UserEntity> {
    try {
      const {password, newPassword, confirmPassword, email} = arg;

      const user: UserEntity = await this.userService.readUserForAuth(email);

      if (!user) {
        throw new HttpBadRequest('User not found. Please make sure you have entered the right e-mail address.');
      }

      if (newPassword !== confirmPassword) throw new HttpBadRequest('New password and confirm password are not match.');

      const isMatch: boolean = await user.comparePassword(password);

      if (!isMatch) {
        throw new HttpBadRequest('Password is incorrect. Please make sure you have entered the right password.');
      }

      const updatedUser = await this.userService.updateUserPassword(user.uuid, newPassword);

      if (!updatedUser) throw new HttpBadRequest("Can't update password");

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }
}
