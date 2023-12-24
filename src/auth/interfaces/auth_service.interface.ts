import {TokenType} from '@/configs/jwt/typedef';
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
import {UserEntity} from '@/modules';

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
  resetPasswordOtp(arg: ResetPasswordOtpDTO): Promise<any>;
  changePassword(arg: ChangePasswordDTO): Promise<any>;
  verifyEmail(arg: VerifyEmailDTO): Promise<any>;
  verifyPhone(arg: VerifyPhoneDTO): Promise<any>;
  verifyOtp(arg: VerifyOtpDTO): Promise<any>;
}
