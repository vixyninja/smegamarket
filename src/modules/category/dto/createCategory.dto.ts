import {Transform} from 'class-transformer';
import {IsNotEmpty, IsString} from 'class-validator';

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({value}) => value.trim())
  readonly description: string;
}
