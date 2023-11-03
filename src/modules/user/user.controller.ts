import {AuthGuard, User, UserDynamic} from '@/core';
import {Controller, Get, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {UserEntity} from './user.entity';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@UserDynamic('uuid') userUUID: string): Promise<any> {
    const user: UserEntity = await this.userService.readUser(userUUID);
    return {data: user};
  }
}
