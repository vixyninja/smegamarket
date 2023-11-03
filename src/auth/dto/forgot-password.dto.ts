import {PickType} from '@nestjs/mapped-types';
import {SignInEmailDTO} from './signin-email.dto';

export class ForgotPasswordDTO extends PickType(SignInEmailDTO, ['email'] as const) {}
