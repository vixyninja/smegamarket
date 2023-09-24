import {IsNotEmpty, IsOptional} from 'class-validator';
import {CreateCourseDataDTO} from './createCourseDataDTO';

export class CreateCourseDTO {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly price: number;

  @IsNotEmpty()
  readonly discount: number;

  @IsOptional()
  readonly thumbnail: Express.Multer.File;

  @IsNotEmpty()
  readonly tags: string[];

  @IsNotEmpty()
  readonly level: string;

  @IsNotEmpty()
  readonly demoURL: string;

  @IsNotEmpty()
  readonly benefits: string;

  @IsNotEmpty()
  readonly prerequisites: string;

  @IsNotEmpty()
  readonly isPublished: boolean;

  @IsNotEmpty()
  readonly rating: number;

  @IsNotEmpty()
  readonly purchased: number;

  @IsOptional()
  readonly courseData: CreateCourseDataDTO[];

  @IsOptional()
  readonly reviews: [];
}
