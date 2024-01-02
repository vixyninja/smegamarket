import {TokenResponse} from '@/configs';
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
} from '../dtos';

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<UserEntity, 'password' | 'salt'>;
}

export interface IAuthService {
  signInEmailAndPassword(arg: SignInEmailDTO): Promise<IAuthResponse>;
  signUpEmailAndPassword(arg: SignUpEmailDTO): Promise<IAuthResponse>;
  signInWithGoogle(arg: SignInGoogleDTO): Promise<IAuthResponse>;
  refreshToken(arg: string): Promise<TokenResponse>;
  forgotPassword(arg: ForgotPasswordDTO): Promise<any>;
  verifyOtpResetPassword(arg: ResetPasswordOtpDTO): Promise<UserEntity>;
  changePassword(arg: ChangePasswordDTO): Promise<UserEntity>;
  sendOtpEmail(arg: VerifyEmailDTO): Promise<any>;
  sendOtpPhone(arg: VerifyPhoneDTO): Promise<any>;
  verifyEmailOrPhone(arg: VerifyOtpDTO): Promise<UserEntity>;
}
