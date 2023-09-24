import {IsNotEmpty} from 'class-validator';

export class CreateCommentDTO {
  @IsNotEmpty()
  readonly owner: string;

  @IsNotEmpty()
  readonly comment: string;

  @IsNotEmpty()
  readonly like: string;
}
