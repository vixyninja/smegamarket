import {Public} from '@/core';
import {BadRequestException, Body, Controller, Post} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';
import {AuthService} from './auth.service';
import {
  ForgotPasswordDTO,
  ResetPasswordOtpDTO,
  SignInEmailDTO,
  SignInGoogleDTO,
  SignOutEmailDTO,
  SignUpEmailDTO,
  VerifyEmailDTO,
  VerifyOtpDTO,
  VerifyPhoneDTO,
} from './dto';

// - AUTH
//   + `POST /auth/sign-in`
//   + `POST /auth/sign-up`
//   + `POST /auth/refresh-token`
//   + `POST /auth/logout`
//   + `POST /auth/forgot-password`
//   + `POST /auth/reset-password-otp`
//   + `POST /auth/verify-email`
//   + `POST /auth/verify-phone`
//   + `POST /auth/verify-otp`
//   + `POST /auth/change-password`
//   + `POST /auth/sign-in-with-google`
//   + `POST /auth/sign-in-with-facebook`

@Public()
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signInEmailAndPassword(@Body() signInEmailDTO: SignInEmailDTO): Promise<any> {
    if (signInEmailDTO.password !== signInEmailDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    return await this.authService.signInEmailAndPassword(signInEmailDTO);
  }

  @Post('sign-up')
  async signUpEmailAndPassword(@Body() signUpEmailDTO: SignUpEmailDTO): Promise<any> {
    if (signUpEmailDTO.password !== signUpEmailDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    return await this.authService.signUpEmailAndPassword(signUpEmailDTO);
  }

  @Post('sign-in-with-google')
  async signInGoogle(@Body() signInGoogleDTO: SignInGoogleDTO): Promise<any> {
    return await this.authService.signInWithGoogle(signInGoogleDTO);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshToken: {refreshToken: string}): Promise<any> {
    if (!refreshToken.refreshToken) return new BadRequestException('Refresh token is required');
    return await this.authService.refreshToken(refreshToken.refreshToken);
  }

  @Post('log-out')
  async signOut(@Body() signOutEmailDTO: SignOutEmailDTO): Promise<any> {
    return await this.authService.logOut(signOutEmailDTO);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO): Promise<any> {
    return await this.authService.forgotPassword(forgotPasswordDTO);
  }

  @Post('reset-password-otp')
  async resetPasswordOtp(@Body() resetPasswordOtpDTO: ResetPasswordOtpDTO): Promise<any> {
    if (resetPasswordOtpDTO.password !== resetPasswordOtpDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    return await this.authService.resetPasswordOtp(resetPasswordOtpDTO);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDTO: VerifyEmailDTO): Promise<any> {
    return await this.authService.verifyEmail(verifyEmailDTO);
  }

  @Post('verify-phone')
  async verifyPhone(@Body() verifyPhoneDTO: VerifyPhoneDTO): Promise<any> {
    return await this.authService.verifyPhone(verifyPhoneDTO);
  }

  @Post('verify-otp')
  async verifyOTP(@Body() verifyOtpDTO: VerifyOtpDTO): Promise<any> {
    return await this.authService.verifyOtp(verifyOtpDTO);
  }
}
