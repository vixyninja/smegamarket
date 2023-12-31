import {Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';
import {isEmail} from 'class-validator';
import {Response} from 'express';
import {I18n, I18nContext} from 'nestjs-i18n';
import {SignInEmailDTO, SignInGoogleDTO, SignUpEmailDTO} from '../dtos';
import {AuthService} from '../services';
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async refreshToken(
    @Query('refresh-token') token: string,
    @I18n() i18n: I18nContext,
    @Res() res: Response,
  ): Promise<any> {
    if (!token) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: i18n.translate('content.auth.refreshToken.missing', {lang: i18n.lang}),
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });
    }

    const credentials = await this.authService.refreshToken(token);

    return res
      .json({
        message: i18n.translate('content.auth.signIn.success', {lang: i18n.lang}),
        statusCode: HttpStatus.OK,
        data: credentials,
      })
      .end();
  }
}
