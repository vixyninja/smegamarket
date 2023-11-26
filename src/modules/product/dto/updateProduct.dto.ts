import {IsOptional} from 'class-validator';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from '../enum';
import {Transform} from 'class-transformer';

export class UpdateProductDTO {
  @IsOptional()
  readonly name: string;

  @IsOptional()
  readonly price: number;

  @IsOptional()
  readonly type: ProductEnum;

  @IsOptional()
  readonly status: StatusEnum;

  @IsOptional()
  readonly size: SizeEnum;

  @IsOptional()
  @Transform((value) => {
    if (value instanceof Array) {
      return value;
    } else {
      return [value];
    }
  })
  readonly detail: string[];

  @IsOptional()
  @Transform((value) => {
    if (value instanceof Array) {
      return value;
    } else {
      return [value];
    }
  })
  readonly benefit: string[];

  @IsOptional()
  @Transform((value) => {
    if (value instanceof Array) {
      return value;
    } else {
      return [value];
    }
  })
  readonly caution: string[];

  @IsOptional()
  readonly sale: SaleEnum;

  @IsOptional()
  readonly link: string;

  @IsOptional()
  readonly brandId: string;

  @IsOptional()
  @Transform((value) => {
    if (value instanceof Array) {
      return value;
    } else {
      return [value];
    }
  })
  readonly category: string[];
}
