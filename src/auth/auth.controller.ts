import {HandlerFilter, Public} from '@/core';
import {BadRequestException, Body, Controller, Get, Post, Query} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';
import {AuthService} from './auth.service';
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
} from './dto';

@Public()
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signInEmailAndPassword(@Body() signInEmailDTO: SignInEmailDTO): Promise<any> {
    const credentials = await this.authService.signInEmailAndPassword(signInEmailDTO);
    return HandlerFilter(credentials, {
      message: 'Sign in successfully',
      data: credentials,
      status: 200,
    });
  }

  @Post('sign-up')
  async signUpEmailAndPassword(@Body() signUpEmailDTO: SignUpEmailDTO): Promise<any> {
    if (signUpEmailDTO.password !== signUpEmailDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    const credentials = await this.authService.signUpEmailAndPassword(signUpEmailDTO);

    return HandlerFilter(credentials, {
      message: 'Sign up successfully',
      data: credentials,
      status: 201,
    });
  }

  @Post('sign-in-with-google')
  async signInGoogle(@Body() signInGoogleDTO: SignInGoogleDTO): Promise<any> {
    const credentials = await this.authService.signInWithGoogle(signInGoogleDTO);

    return HandlerFilter(credentials, {
      message: 'Sign in with google successfully',
      data: credentials,
    });
  }

  @Get('refresh-token')
  async refreshToken(@Query() token: {token: string}): Promise<any> {
    if (!token.token) return new BadRequestException('Refresh token is required');
    const credentials = await this.authService.refreshToken(token.token);
    return HandlerFilter(credentials, {
      message: 'Refresh token successfully',
      data: credentials,
    });
  }

  @Get('log-out')
  async signOut(@Query() information: {information: string}): Promise<any> {
    await this.authService.logOut(information.information);
    return {
      message: 'Log out successfully',
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO): Promise<any> {
    const message = await this.authService.forgotPassword(forgotPasswordDTO);
    return HandlerFilter(message, {
      message: message,
    });
  }

  @Post('reset-password-otp')
  async resetPasswordOtp(@Body() resetPasswordOtpDTO: ResetPasswordOtpDTO): Promise<any> {
    if (resetPasswordOtpDTO.password !== resetPasswordOtpDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    const message = await this.authService.resetPasswordOtp(resetPasswordOtpDTO);
    return HandlerFilter(message, {
      message: message,
    });
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDTO: ChangePasswordDTO): Promise<any> {
    if (changePasswordDTO.password !== changePasswordDTO.confirmPassword)
      return new BadRequestException('Password and confirm password not match');
    const message = await this.authService.changePassword(changePasswordDTO);
    return HandlerFilter(message, {
      message: message,
    });
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDTO: VerifyEmailDTO): Promise<any> {
    const message = await this.authService.verifyEmail(verifyEmailDTO);

    return HandlerFilter(message, {
      message: message,
    });
  }

  @Post('verify-phone')
  async verifyPhone(@Body() verifyPhoneDTO: VerifyPhoneDTO): Promise<any> {
    const message = await this.authService.verifyPhone(verifyPhoneDTO);
    return HandlerFilter(message, {
      message: message,
    });
  }

  @Post('verify-otp')
  async verifyOTP(@Body() verifyOtpDTO: VerifyOtpDTO): Promise<any> {
    const message = await this.authService.verifyOtp(verifyOtpDTO);
    return HandlerFilter(message, {
      message: message,
    });
  }
}
