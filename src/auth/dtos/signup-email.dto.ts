import {IsEmail, IsNotEmpty, IsOptional, MinLength} from 'class-validator';

export class SignUpEmailDTO {
  @IsEmail({}, {message: 'Your email is invalid, please check again!'})
  @IsNotEmpty({message: 'Your email is required!'})
  readonly email: string;

  @IsNotEmpty({message: 'Your password is required!'})
  @MinLength(6, {message: 'Your password must be at least 6 characters!'})
  readonly password: string;

  @IsNotEmpty({message: 'Your confirm password is required!'})
  @MinLength(6, {message: 'Your confirm password must be at least 6 characters!'})
  readonly confirmPassword: string;

  @IsOptional()
  readonly deviceToken: string;
}
