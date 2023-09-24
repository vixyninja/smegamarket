import {IsNotEmpty} from 'class-validator';

export class CreateLinkDTO {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly url: string;
}
