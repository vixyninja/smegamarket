import {OmitType} from '@nestjs/mapped-types';
import {ResetPasswordOtpDTO} from './reset-password-otp.dto';
import {IsNotEmpty, MinLength} from 'class-validator';

export class ChangePasswordDTO extends OmitType(ResetPasswordOtpDTO, ['otp']) {
  @IsNotEmpty({message: 'New password is required!'})
  @MinLength(6, {message: 'Your new password must be at least 6 characters!'})
  readonly newPassword: string;
}
