import {IsEmail, IsNotEmpty} from 'class-validator';

export class SignInEmailDTO {
  @IsEmail({}, {message: 'Email is invalid'})
  readonly email: string;

  @IsNotEmpty({message: 'Password is required'})
  readonly password: string;

  @IsNotEmpty({message: 'Re-password is required'})
  readonly confirmPassword: string;

  @IsNotEmpty({message: 'Device token is required'})
  readonly deviceToken: string;

  @IsNotEmpty({message: 'Device type is required'})
  readonly deviceType: string;

  @IsNotEmpty({message: 'First name is required'})
  readonly firstName: string;

  @IsNotEmpty({message: 'Last name is required'})
  readonly lastName: string;
}
