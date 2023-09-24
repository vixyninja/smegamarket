import {IsNotEmpty} from 'class-validator';

export class CreateCourseDataDTO {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  videoURL: string;

  @IsNotEmpty()
  videoThumbnail: Express.Multer.File;

  @IsNotEmpty()
  videoSelection: string;

  @IsNotEmpty()
  videoDuration: Number;

  @IsNotEmpty()
  videoPlayer: string;

  @IsNotEmpty()
  links: [string];
}
