import {AuthGuard, HandlerFilter, HttpBadRequest, UserDynamic} from '@/core';
import {Body, Controller, Get, Put, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {isEmail, isPhoneNumber, isUUID} from 'class-validator';
import {UpdateUserDTO} from '../dto';
import {UserService} from '../services';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getProfile(@UserDynamic('uuid') userUUID: string): Promise<any> {
    if (!isUUID(userUUID)) {
      return new HttpBadRequest('UserUUID is not valid');
    }

    const user = await this.userService.readUser(userUUID);
    return HandlerFilter(user, {
      message: 'Get profile successfully',
      data: user,
      status: 200,
    });
  }

  @Put('/me')
  async updateProfile(@UserDynamic('uuid') userUUID: string, @Body() updateUserDTO: UpdateUserDTO): Promise<any> {
    if (!isUUID(userUUID)) {
      return new HttpBadRequest('UserUUID is not valid');
    }

    const user = await this.userService.updateUser(userUUID, updateUserDTO);
    return HandlerFilter(user, {
      message: 'Update profile successfully',
      data: user,
      status: 200,
    });
  }

  @Put('/me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(@UserDynamic('uuid') userUUID: string, @UploadedFile() file: Express.Multer.File): Promise<any> {
    const user = await this.userService.updateUserAvatar(userUUID, file);
    return HandlerFilter(user, {
      message: 'Update avatar successfully',
      data: user,
      status: 200,
    });
  }

  @Put('/me/cover')
  @UseInterceptors(FileInterceptor('cover'))
  async updateCover(@UserDynamic('uuid') userUUID: string, @UploadedFile() file: Express.Multer.File): Promise<any> {
    const user = await this.userService.updateUserCover(userUUID, file);
    return HandlerFilter(user, {
      message: 'Update cover successfully',
      data: user,
      status: 200,
    });
  }

  @Put('/me/phone')
  async updatePhone(@UserDynamic('uuid') userUUID: string, @Body('phone') phone: string): Promise<any> {
    const user = await this.userService.updateUserPhone(userUUID, phone);

    if (!isPhoneNumber(phone, 'VN')) {
      return new HttpBadRequest('Phone is not valid');
    }

    return HandlerFilter(user, {
      message: 'Update phone successfully',
      data: user,
      status: 200,
    });
  }

  @Put('/me/email')
  async updateEmail(@UserDynamic('uuid') userUUID: string, @Body('email') email: string): Promise<any> {
    const user = await this.userService.updateUserEmail(userUUID, email);

    if (!isEmail(email)) {
      return new HttpBadRequest('Email is not valid');
    }

    return HandlerFilter(user, {
      message: 'Update email successfully',
      data: user,
      status: 200,
    });
  }
}