import {IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber} from 'class-validator';

export class CreateBrandDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly description: string;

  @IsEmail()
  readonly email: string;

  @IsOptional()
  readonly address: string;

  @IsOptional()
  @IsPhoneNumber('VN')
  readonly phone: string;

  @IsOptional()
  readonly website: string;
}
