import {IsNotEmpty, IsOptional} from 'class-validator';

export class CreateProductDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly link: string;

  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  readonly brandId: string;

  @IsNotEmpty()
  readonly category: string | string[];

  @IsOptional()
  readonly detail: string | string[];
}
