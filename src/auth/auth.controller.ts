import {Public} from '@/core';
import {BadRequestException, Body, Controller, Injectable, Post} from '@nestjs/common';
import {SkipThrottle} from '@nestjs/throttler';
import {AuthService} from './auth.service';
import {SignInEmailDTO, SignInGoogleDTO} from './dto';

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
  async signUpEmailAndPassword(@Body() signInEmailDTO: SignInEmailDTO): Promise<any> {
    if (signInEmailDTO.password !== signInEmailDTO.confirmPassword)
      throw new BadRequestException('Password and confirm password not match');
    return await this.authService.signUpEmailAndPassword(signInEmailDTO);
  }
}
