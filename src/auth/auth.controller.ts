import {Body, Controller, Post, SetMetadata, UseGuards} from '@nestjs/common';

import {IS_PUBLIC_KEY} from 'src/core';
import {AuthService} from './auth.service';
import {ForgotPasswordDTO, LoginDTO, RegisterDTO} from './dto';
import {FirebaseAuthGuard} from './firebase';
@UseGuards(FirebaseAuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SetMetadata(IS_PUBLIC_KEY, true)
  @Post('register')
  async register(@Body() registerDTO: any) {
    const dto = new RegisterDTO(registerDTO);
    return await this.authService.register(dto);
  }

  @SetMetadata(IS_PUBLIC_KEY, true)
  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    return await this.authService.login(loginDTO);
  }

  @SetMetadata(IS_PUBLIC_KEY, true)
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDTO: any) {
    const dto = new ForgotPasswordDTO(forgotPasswordDTO);
    return await this.authService.forgotPassword(dto);
  }

  @SetMetadata(IS_PUBLIC_KEY, true)
  @Post('refresh-token')
  async refreshToken(@Body() {refreshToken}) {
    return await this.authService.refreshToken(refreshToken);
  }
}
