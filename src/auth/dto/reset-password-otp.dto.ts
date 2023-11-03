import {IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class ResetPasswordOtpDTO {
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly confirmPassword: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(6)
  readonly code: string;

  @IsEmail()
  readonly email: string;
}
