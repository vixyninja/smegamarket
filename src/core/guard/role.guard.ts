import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {RoleEnum} from './role.enum';
import {HttpBadRequest} from '../filter';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(RoleEnum, [
        context.getHandler(),
        context.getClass(),
      ]);
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const hasRole = () => requiredRoles.every((role) => user.role?.includes(role));
      if (!(user && user.role && hasRole())) {
        throw new HttpBadRequest('You do not have permission to access this resource');
      }
      return true;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
