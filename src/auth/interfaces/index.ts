import {JWTPayload} from '@/configs/jwt/type.jwt';
import {UserEntity} from '@/modules';
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

export interface IAuthService {
  signInEmailAndPassword(
    arg: SignInEmailDTO,
  ): Promise<{accessToken: string; refreshToken: string; user: Omit<UserEntity, 'password' | 'salt'>}>;
  signUpEmailAndPassword(
    arg: SignUpEmailDTO,
  ): Promise<{accessToken: string; refreshToken: string; user: Omit<UserEntity, 'password' | 'salt'>}>;
  signInWithGoogle(
    arg: SignInGoogleDTO,
  ): Promise<{accessToken: string; refreshToken: string; user: Omit<UserEntity, 'password' | 'salt'>}>;
  signInWithFacebook(): Promise<any>;
  refreshToken(arg: string): Promise<{accessToken: string; refreshToken: string}>;
  forgotPassword(arg: ForgotPasswordDTO): Promise<any>;
  sendOtpResetPassword(arg: ResetPasswordOtpDTO): Promise<any>;
  changePassword(arg: ChangePasswordDTO): Promise<any>;

  sendOtpEmail(arg: VerifyEmailDTO): Promise<any>;
  sendOtpPhone(arg: VerifyPhoneDTO): Promise<any>;
  verifyEmailOrPhone(arg: VerifyOtpDTO): Promise<any>;
}
