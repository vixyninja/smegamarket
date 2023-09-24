import {IsNotEmpty, IsOptional} from 'class-validator';
import {CreateCommentDTO} from 'src/modules/comment/dto';

export class CreateReviewDTO {
  @IsNotEmpty()
  readonly user: string;

  @IsNotEmpty()
  readonly rating: number;

  @IsOptional()
  readonly comment: CreateCommentDTO;

  @IsOptional()
  readonly commentReply: CreateCommentDTO;
}
