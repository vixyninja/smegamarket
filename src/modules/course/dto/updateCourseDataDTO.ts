import {PartialType} from '@nestjs/mapped-types';
import {CreateCourseDataDTO} from './createCourseDataDTO';

export class UpdateCourseDataDTO extends PartialType(CreateCourseDataDTO) {}
