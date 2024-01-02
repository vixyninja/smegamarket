import {IsEmail, IsNotEmpty, IsOptional} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty({message: 'Your first name is required!'})
  readonly firstName: string;

  @IsNotEmpty({message: 'Your last name is required!'})
  readonly lastName: string;

  @IsEmail({}, {message: 'Your email is invalid, please check again!'})
  readonly email: string;

  @IsNotEmpty({message: 'Your password is required!'})
  readonly password: string;

  @IsNotEmpty({message: 'Two factor temp secret is required!'})
  readonly twoFactorTempSecret: string;

  @IsOptional()
  readonly deviceToken: string;
}
