import {IsEmail, IsNotEmpty, IsPhoneNumber} from 'class-validator';

export class CreateBrandDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly address: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  readonly phoneNumber: string;

  @IsNotEmpty()
  readonly website: string;

  @IsEmail()
  readonly email: string;
}
