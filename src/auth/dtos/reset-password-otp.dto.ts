import {IsEmail, IsNotEmpty, Length, MinLength} from 'class-validator';

export class ResetPasswordOtpDTO {
  @IsNotEmpty({message: 'Your email is required!'})
  @IsEmail({}, {message: 'Your email is invalid, please check again!'})
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6, {message: 'Your password must be at least 6 characters!'})
  readonly password: string;

  @IsNotEmpty()
  @MinLength(6, {message: 'Your confirm password must be at least 6 characters!'})
  readonly confirmPassword: string;

  @IsNotEmpty({message: 'Your OTP is required!'})
  @Length(6, 6, {message: 'Your OTP must be 6 characters!'})
  readonly otp: number;
}
