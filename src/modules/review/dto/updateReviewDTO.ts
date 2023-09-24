import {PartialType} from '@nestjs/mapped-types';
import {CreateReviewDTO} from './createReviewDTO';

export class UpdateReviewDTO extends PartialType(CreateReviewDTO) {}
