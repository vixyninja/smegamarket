import {IsEmail, IsNotEmpty} from 'class-validator';

export class CreateBrandDTO {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  website: string;

  @IsEmail()
  email: string;
}
