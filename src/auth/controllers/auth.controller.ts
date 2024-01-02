import {Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Put, Query, Res} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';
import {isEmail} from 'class-validator';
import {Response} from 'express';
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
import {AuthService} from '../services';
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signInEmailAndPassword(@Body() signInEmailDTO: SignInEmailDTO, @Res() res: Response): Promise<any> {
    if (!isEmail(signInEmailDTO.email)) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({
          message: 'Email is not valid',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
        .end();
    }
    const credentials = await this.authService.signInEmailAndPassword(signInEmailDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: 'Sign in successfully',
        statusCode: HttpStatus.OK,
        data: credentials,
      })
      .end();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  async signUpEmailAndPassword(@Body() signUpEmailDTO: SignUpEmailDTO, @Res() res: Response): Promise<any> {
    if (signUpEmailDTO.password !== signUpEmailDTO.confirmPassword) {
      return res
        .status(HttpStatus.UNPROCESSABLE_ENTITY)
        .json({
          message: 'Password and confirm password are not match',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        })
        .end();
    }

    const credentials = await this.authService.signUpEmailAndPassword(signUpEmailDTO);

    return res.status(HttpStatus.CREATED).json({
      message: 'Sign up successfully',
      statusCode: HttpStatus.CREATED,
      data: credentials,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign-in-with-google')
  async signInGoogle(@Body() signInGoogleDTO: SignInGoogleDTO, @Res() res: Response): Promise<any> {
    const credentials = await this.authService.signInWithGoogle(signInGoogleDTO);

    return res
      .json({
        message: 'Sign in successfully',
        statusCode: HttpStatus.OK,
        data: credentials,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Get('refresh-token')
  async refreshToken(@Query('token') token: string, @Res() res: Response): Promise<any> {
    if (!token) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'Refresh token is required',
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const credentials = await this.authService.refreshToken(token);

    return res
      .json({
        message: 'Refresh token successfully',
        statusCode: HttpStatus.OK,
        data: credentials,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO, @Res() res: Response): Promise<any> {
    const job = await this.authService.forgotPassword(forgotPasswordDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: job.message,
        statusCode: HttpStatus.OK,
        data: job.id,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Patch('verify-otp-reset-password')
  async verifyOtpResetPassword(@Body() resetPasswordOtpDTO: ResetPasswordOtpDTO, @Res() res: Response): Promise<any> {
    const user = await this.authService.verifyOtpResetPassword(resetPasswordOtpDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: 'Verify OTP successfully',
        statusCode: HttpStatus.OK,
        data: user,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Patch('change-password')
  async changePassword(@Body() changePasswordDTO: ChangePasswordDTO, @Res() res: Response): Promise<any> {
    const user = await this.authService.changePassword(changePasswordDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: 'Change password successfully',
        statusCode: HttpStatus.OK,
        data: user,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-otp-email')
  async sendOtpEmail(@Body() verifyEmailDTO: VerifyEmailDTO, @Res() res: Response): Promise<any> {
    const job = await this.authService.sendOtpEmail(verifyEmailDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: job.message,
        statusCode: HttpStatus.OK,
        data: job.data,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Post('send-otp-phone')
  async sendOtpPhone(@Body() verifyPhoneDTO: VerifyPhoneDTO, @Res() res: Response): Promise<any> {
    const job = await this.authService.sendOtpPhone(verifyPhoneDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: job.message,
        statusCode: HttpStatus.OK,
        data: job.data,
      })
      .end();
  }

  @HttpCode(HttpStatus.OK)
  @Put('verify-email-or-phone')
  async verifyEmailOrPhone(@Body() verifyOtpDTO: VerifyOtpDTO, @Res() res: Response): Promise<any> {
    const user = await this.authService.verifyEmailOrPhone(verifyOtpDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: 'Verify OTP successfully',
        statusCode: HttpStatus.OK,
        data: user,
      })
      .end();
  }
}
