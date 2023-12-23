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
  ): Promise<{token: TokenType; user: Omit<UserEntity, 'hashPassword' | 'salt'>}>;
  signUpEmailAndPassword(
    arg: SignUpEmailDTO,
  ): Promise<{token: TokenType; user: Omit<UserEntity, 'hashPassword' | 'salt'>}>;
  signInWithGoogle(arg: SignInGoogleDTO): Promise<{token: TokenType; user: Omit<UserEntity, 'hashPassword' | 'salt'>}>;
  signInWithFacebook(): Promise<any>;
  refreshToken(arg: string): Promise<{accessToken: string; refreshToken: string}>;
  forgotPassword(arg: ForgotPasswordDTO): Promise<any>;
  resetPasswordOtp(arg: ResetPasswordOtpDTO): Promise<any>;
  changePassword(arg: ChangePasswordDTO): Promise<any>;
  verifyEmail(arg: VerifyEmailDTO): Promise<any>;
  verifyPhone(arg: VerifyPhoneDTO): Promise<any>;
  verifyOtp(arg: VerifyOtpDTO): Promise<any>;
}
