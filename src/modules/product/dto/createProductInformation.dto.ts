import {IsNotEmpty, IsOptional} from 'class-validator';

export class CreateProductInformationDTO {
  @IsNotEmpty()
  readonly price: number;

  @IsOptional()
  readonly type: string;

  @IsOptional()
  readonly status: string;

  @IsOptional()
  readonly size: string;

  @IsOptional()
  readonly sale: string;

  @IsOptional()
  readonly link: string;

  @IsOptional()
  readonly description: string;
}
