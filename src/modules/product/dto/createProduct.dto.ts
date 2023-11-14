import {IsArray, IsEnum, IsNotEmpty} from 'class-validator';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from '../enum';

export class CreateProductDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly price: number;

  @IsEnum(ProductEnum)
  readonly type: string;

  @IsEnum(StatusEnum)
  readonly status: string;

  @IsEnum(SizeEnum)
  readonly size: string;

  readonly detail: string;

  readonly benefit: string;

  readonly caution: string;

  @IsEnum(SaleEnum)
  readonly sale: string;

  readonly link: string;

  @IsNotEmpty()
  readonly brandId: string;

  @IsNotEmpty()
  @IsArray()
  readonly category: string[];
}
