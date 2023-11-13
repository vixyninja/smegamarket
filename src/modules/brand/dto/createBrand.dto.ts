import {IsEmail, IsNotEmpty, IsPhoneNumber} from 'class-validator';

export class CreateBrandDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsNotEmpty()
  website: string;

  @IsEmail()
  email: string;
}
