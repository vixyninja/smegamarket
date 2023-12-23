import {Public} from '@/core';
import {BadRequestException, Body, Controller, Get, HttpStatus, Post, Query, Res} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';
import {isEmail} from 'class-validator';
import {Response} from 'express';
import {I18n, I18nContext} from 'nestjs-i18n';
import {SignInEmailDTO, SignInGoogleDTO, SignUpEmailDTO} from '../dto';
import {AuthService} from '../services';
@Public()
@SkipThrottle()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signInEmailAndPassword(
    @Body() signInEmailDTO: SignInEmailDTO,
    @I18n() i18n: I18nContext,
    @Res() res: Response,
  ): Promise<any> {
    if (!isEmail(signInEmailDTO.email)) {
      throw new BadRequestException(i18n.translate('content.auth.signIn.wrongCredentials', {lang: i18n.lang}));
    }
    const credentials = await this.authService.signInEmailAndPassword(signInEmailDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: i18n.translate('content.auth.signIn.success'),
        data: credentials,
      })
      .end();
  }

  @Post('sign-up')
  async signUpEmailAndPassword(
    @Body() signUpEmailDTO: SignUpEmailDTO,
    @I18n() i18n: I18nContext,
    @Res() res: Response,
  ): Promise<any> {
    if (signUpEmailDTO.password !== signUpEmailDTO.confirmPassword) {
      throw new BadRequestException(i18n.translate('content.auth.confirmPassword.mustMatch'));
    }

    const credentials = await this.authService.signUpEmailAndPassword(signUpEmailDTO);

    return res.status(HttpStatus.CREATED).json({
      message: i18n.translate('content.auth.signUp.success'),
      data: credentials,
    });
  }

  @Post('sign-in-with-google')
  async signInGoogle(
    @Body() signInGoogleDTO: SignInGoogleDTO,
    @I18n() i18n: I18nContext,
    @Res() res: Response,
  ): Promise<any> {
    const credentials = await this.authService.signInWithGoogle(signInGoogleDTO);

    return res
      .status(HttpStatus.OK)
      .json({
        message: i18n.translate('content.auth.signIn.success'),
        data: credentials,
      })
      .end();
  }

  @Get('refresh-token')
  async refreshToken(
    @Query('refresh-token') token: string,
    @I18n() i18n: I18nContext,
    @Res() res: Response,
  ): Promise<any> {
    if (!token) {
      return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        message: i18n.translate('content.auth.refreshToken.missing'),
      });
    }

    const credentials = await this.authService.refreshToken(token);

    return res
      .status(HttpStatus.OK)
      .json({
        message: i18n.translate('content.auth.signIn.success'),
        data: credentials,
      })
      .end();
  }
}
