import {SizeEnum} from '@/modules/product';
import {IsEnum, IsNotEmpty, IsNumber, IsString} from 'class-validator';

export class CreateCartItemDTO {
  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  @IsEnum(SizeEnum, {message: `Size must be one of these values: ${Object.values(SizeEnum)}`})
  size: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  brandId: string;
}
