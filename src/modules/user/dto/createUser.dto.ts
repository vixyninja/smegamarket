import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
