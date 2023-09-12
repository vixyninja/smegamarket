import {IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({message: 'Email is required'})
  @IsEmail({}, {message: 'Email is not valid'})
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  @MinLength(6, {message: 'Password must be at least 6 characters'})
  @MaxLength(20, {message: 'Password must be at most 20 characters'})
  password: string;

  deviceToken: string;
}
