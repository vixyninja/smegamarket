import {SetMetadata, UseGuards, applyDecorators} from '@nestjs/common';
import {RoleEnum} from '../guard';
import {AuthGuard} from '@nestjs/passport';
import {RolesGuard} from '../guard/role.guard';

export function Auth(...role: RoleEnum[]) {
  return applyDecorators(SetMetadata('role', role), UseGuards(AuthGuard, RolesGuard));
}
