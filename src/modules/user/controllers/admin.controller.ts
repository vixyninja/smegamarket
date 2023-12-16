import {AuthGuard, HandlerFilter, HttpBadRequest, RoleEnum, Roles, RolesGuard} from '@/core';
import {QueryOptions} from '@/core/interface';
import {Body, Controller, Delete, Get, Param, Put, Query, UseGuards} from '@nestjs/common';
import {isUUID} from 'class-validator';
import {StatusUser} from '../enum';
import {UserService} from '../services';

@UseGuards(AuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: UserService) {}

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Get('user')
  async getAllUser() {
    const users = await this.adminService.readUsers();
    return HandlerFilter(users, {
      data: users,
      message: 'Get all users successfully',
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Get('user/q')
  async queryUser(@Query() query: QueryOptions) {
    const users = await this.adminService.query(query);
    return HandlerFilter(users, {
      data: users.data,
      message: 'Query users successfully',
      meta: users.meta,
    });
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put('/user/:userId/role')
  async updateAdmin(@Param('userId') userId: string, @Body('role') role: RoleEnum): Promise<any> {
    if (!role) {
      return new HttpBadRequest('Role is required');
    }

    if (!Object.values(RoleEnum).includes(role)) {
      return new HttpBadRequest('Role is not valid');
    }

    if (!isUUID(userId)) {
      return new HttpBadRequest('UserUUID is not valid');
    }

    const user = await this.adminService.updateUserRole(userId, role);
    return {
      data: user,
      message: 'Update admin successfully',
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Put('/user/:userId/status')
  async updateUserStatus(@Param('userId') userId: string, @Body('status') status: StatusUser): Promise<any> {
    if (!status) {
      return new HttpBadRequest('Status is required');
    }

    if (!Object.values(StatusUser).includes(status)) {
      return new HttpBadRequest('Status is not valid');
    }

    if (!isUUID(userId)) {
      return new HttpBadRequest('UserUUID is not valid');
    }

    const user = await this.adminService.updateUserStatus(userId, status);
    return {
      data: user,
      message: 'Update status successfully',
    };
  }

  @Roles([RoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @Delete('/user/:userId')
  async updateActive(@Param('userId') userId: string): Promise<any> {
    if (!isUUID(userId)) {
      return new HttpBadRequest('UserUUID is not valid');
    }

    const user = await this.adminService.deleteUser(userId);
    return {
      data: user,
      message: 'Update active successfully',
    };
  }
}
