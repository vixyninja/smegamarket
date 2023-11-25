import {
  AuthGuard,
  HandlerFilter,
  HttpBadRequest,
  HttpInternalServerError,
  RoleEnum,
  Roles,
  RolesGuard,
  UserDynamic,
} from '@/core';
import * as faker from '@faker-js/faker';
import {Body, Controller, Get, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {CreateUserDTO, UpdateUserDTO} from './dto';
import {UserEntity} from './entities';
import {UserService} from './user.service';
import {isUUID} from 'class-validator';

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
    const user: UserEntity = await this.userService.updateUserPhone(userUUID, phone);
    return {data: user, message: 'Update phone successfully'};
  }

  @Put('/me/email')
  async updateEmail(@UserDynamic('uuid') userUUID: string, @Body('email') email: string): Promise<any> {
    const user = await this.userService.updateUserEmail(userUUID, email);
    return HandlerFilter(user, {
      message: 'Update email successfully',
      data: user,
      status: 200,
    });
  }

  @Patch('/me/update-role')
  async updateAdmin(
    @UserDynamic('uuid') userUUID: string,
    @Body()
    updateAdminDTO: {
      role: RoleEnum;
    },
  ): Promise<any> {
    const user = await this.userService.updateUserRole(userUUID, updateAdminDTO.role);
    return {data: user, message: 'Update admin successfully'};
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async importUsers(): Promise<any> {
    try {
      faker.fakerVI.seed(Date.now());

      for (let i = 0; i < 10; i++) {
        let firstName = faker.fakerVI.person.firstName();

        let lastName = faker.fakerVI.person.lastName();

        let email = faker.fakerVI.internet.email({
          firstName: firstName,
          lastName: lastName,
          provider: 'gmail',
          allowSpecialCharacters: false,
        });

        const user: CreateUserDTO = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: 'mega123456',
        };

        await this.userService.createUser(user);
      }

      const users = await this.userService.readUsers();

      return {
        message: 'Import users successfully',
        data: users,
      };
    } catch (e) {}
  }
}
