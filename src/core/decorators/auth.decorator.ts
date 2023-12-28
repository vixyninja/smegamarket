import {UseGuards, applyDecorators} from '@nestjs/common';
import {AuthGuard, RoleEnum, RolesGuard} from '../guard';
import {PublicRoute} from './public.decorator';
import {Roles} from './role.decorator';

export function Auth(roles: RoleEnum[] = [], options: {isPublic?: boolean} = {isPublic: false}): MethodDecorator {
  const isPublicRoute = options.isPublic || false;

  return applyDecorators(PublicRoute(isPublicRoute), Roles(roles), UseGuards(AuthGuard, RolesGuard));
}
