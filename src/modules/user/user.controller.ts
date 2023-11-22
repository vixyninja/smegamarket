import {AuthGuard, RoleEnum, Roles, RolesGuard, UserDynamic} from '@/core';
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {UserEntity} from './user.entity';
import {UserService} from './user.service';
import {UpdateUserDTO} from './dto';
import {FileInterceptor} from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@UserDynamic('uuid') userUUID: string): Promise<any> {
    const user: UserEntity = await this.userService.readUser(userUUID);
    return {data: user};
  }

  @Put()
  async updateProfile(
    @UserDynamic('uuid') userUUID: string,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<any> {
    const user: UserEntity = await this.userService.updateUser(
      userUUID,
      updateUserDTO,
    );
    return {data: user, message: 'Update profile successfully'};
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(
    @UserDynamic('uuid') userUUID: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const user: UserEntity = await this.userService.updateUserAvatar(
      userUUID,
      file,
    );
    return {data: user, message: 'Update avatar successfully'};
  }

  @Patch('password')
  async updatePassword(
    @UserDynamic('uuid') userUUID: string,
    @Body('password') password: string,
  ): Promise<any> {
    const user: UserEntity = await this.userService.updateUserPassword(
      userUUID,
      password,
    );
    return {data: user, message: 'Update password successfully'};
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Post('import')
  async importUsers(): Promise<any> {
    return await this.userService.importUsers();
  }
}
