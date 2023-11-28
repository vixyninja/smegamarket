import {IsNotEmpty, IsOptional} from 'class-validator';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from '../enum';

export class CreateProductInformationDTO {
  @IsNotEmpty()
  readonly price: number;

  @IsOptional()
  readonly type: ProductEnum;

  @IsOptional()
  readonly status: StatusEnum;

  @IsOptional()
  readonly size: SizeEnum;

  @IsOptional()
  readonly detail: string | string[];

  @IsOptional()
  readonly benefit: string | string[];

  @IsOptional()
  readonly caution: string | string[];

  @IsOptional()
  readonly sale: SaleEnum;
}
