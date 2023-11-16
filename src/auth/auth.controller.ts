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
} from './dto';

@Public()
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async signInGoogle(@Body() signInGoogleDTO: SignInGoogleDTO): Promise<any> {
    return await this.authService.signInGoogle(signInGoogleDTO);
  }

  @Post('sign-up')
  async signUpEmailAndPassword(
    @Body() signUpEmailDTO: SignUpEmailDTO,
  ): Promise<any> {
    if (signUpEmailDTO.password !== signUpEmailDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    return await this.authService.signUpEmailAndPassword(signUpEmailDTO);
  }

  @Post('sign-in')
  async signInEmailAndPassword(
    @Body() signInEmailDTO: SignInEmailDTO,
  ): Promise<any> {
    if (signInEmailDTO.password !== signInEmailDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    return await this.authService.signInEmailAndPassword(signInEmailDTO);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDTO: ForgotPasswordDTO,
  ): Promise<any> {
    return await this.authService.forgotPassword(forgotPasswordDTO);
  }

  @Post('reset-password-otp')
  async resetPasswordOtp(
    @Body() resetPasswordOtpDTO: ResetPasswordOtpDTO,
  ): Promise<any> {
    if (resetPasswordOtpDTO.password !== resetPasswordOtpDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    return await this.authService.resetPasswordOtp(resetPasswordOtpDTO);
  }

  @Post('sign-out')
  async signOut(@Body() signOutEmailDTO: SignOutEmailDTO): Promise<any> {
    return await this.authService.signOut(signOutEmailDTO);
  }
}
