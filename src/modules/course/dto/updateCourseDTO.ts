import {PartialType} from '@nestjs/mapped-types';
import {CreateCourseDTO} from './createCourseDTO';

export class UpdateCourseDTO extends PartialType(CreateCourseDTO) {}
