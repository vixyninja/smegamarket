import {IsEmail, IsNotEmpty, MaxLength, MinLength} from 'class-validator';
import {HttpBadRequest} from 'src/core';

export class RegisterDTO {
  @IsEmail({}, {message: 'Email is not valid'})
  @IsNotEmpty({message: 'Email is required'})
  email: string;

  @IsNotEmpty({message: 'Password is required'})
  @MinLength(6, {message: 'Password must be at least 6 characters'})
  @MaxLength(20, {message: 'Password must be at most 20 characters'})
  password: string;

  @IsNotEmpty({message: 'Confirm password is required'})
  @MinLength(6, {message: 'Confirm password must be at least 6 characters'})
  @MaxLength(20, {message: 'Confirm password must be at most 20 characters'})
  confirmPassword: string;

  constructor(partial: Partial<RegisterDTO>) {
    Object.assign(this, partial);
    if (this.password !== this.confirmPassword)
      throw new HttpBadRequest('Password and confirm password must be the same');
  }
}
