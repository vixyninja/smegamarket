import {OmitType} from '@nestjs/mapped-types';
import {ResetPasswordOtpDTO} from './reset-password-otp.dto';

export class ChangePasswordDTO extends OmitType(ResetPasswordOtpDTO, ['otp']) {}
