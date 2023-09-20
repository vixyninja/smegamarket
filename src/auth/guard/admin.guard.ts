import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {HttpUnauthorized} from 'src/core';
import {UserService} from 'src/modules/user';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userRole = await this.userService.getRole(request['user'].user_id);
    console.log(userRole);
    if (await this.validateAdmin(userRole)) return true;
    throw new HttpUnauthorized();
  }

  async validateAdmin(role: any) {
    if (role === 'admin') return true;
    return false;
  }
}
