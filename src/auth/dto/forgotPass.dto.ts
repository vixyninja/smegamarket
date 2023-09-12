import {IsEmail, IsNotEmpty} from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, {message: 'Email is invalid'})
  @IsNotEmpty({message: 'Email is required'})
  email: string;

  constructor(partial: Partial<ForgotPasswordDTO>) {
    Object.assign(this, partial);
  }
}
