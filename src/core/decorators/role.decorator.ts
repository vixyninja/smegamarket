import {SetMetadata} from '@nestjs/common';
import {RoleEnum} from '../guard';

export const Roles = (roles: RoleEnum[]) => SetMetadata(RoleEnum, roles);
