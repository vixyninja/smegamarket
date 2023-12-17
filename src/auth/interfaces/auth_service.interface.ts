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
