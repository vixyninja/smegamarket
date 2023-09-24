import {IsNotEmpty, IsOptional} from 'class-validator';

export class CreateCourseDataDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  videoURL: string;

  @IsNotEmpty()
  videoSelection: string;

  @IsNotEmpty()
  videoDuration: Number;

  @IsNotEmpty()
  videoPlayer: string;

  @IsOptional()
  links: [string];
}
