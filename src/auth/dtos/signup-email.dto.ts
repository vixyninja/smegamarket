import {IsEmail, IsNotEmpty, MinLength} from 'class-validator';

export class SignUpEmailDTO {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly confirmPassword: string;

  @IsNotEmpty()
  readonly deviceToken: string;

  @IsNotEmpty()
  readonly deviceType: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;
}
