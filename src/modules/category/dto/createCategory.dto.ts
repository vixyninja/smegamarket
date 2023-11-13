import {IsNotEmpty, IsString} from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
