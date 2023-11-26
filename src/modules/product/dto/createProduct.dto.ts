import {IsArray, IsEnum, IsNotEmpty, IsOptional} from 'class-validator';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from '../enum';
import {Transform} from 'class-transformer';

export class CreateProductDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly price: number;

  @IsOptional()
  readonly link: string;

  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  readonly brandId: string;

  @IsNotEmpty()
  readonly category: string | string[];
}

// @IsOptional()
// readonly type: ProductEnum;

// @IsOptional()
// readonly status: StatusEnum;

// @IsOptional()
// readonly size: SizeEnum;

// @IsOptional()
// readonly detail: string | string[];

// @IsOptional()
// readonly benefit: string | string[];

// @IsOptional()
// readonly caution: string | string[];

// @IsOptional()
// readonly sale: SaleEnum;
