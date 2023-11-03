import {PickType} from '@nestjs/mapped-types';
import {SignUpEmailDTO} from './signup-email.dto';

export class SignInEmailDTO extends PickType(SignUpEmailDTO, [
  'email',
  'password',
  'confirmPassword',
  'deviceToken',
  'deviceType',
] as const) {}
