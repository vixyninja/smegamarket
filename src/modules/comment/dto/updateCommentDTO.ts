import {PartialType} from '@nestjs/mapped-types';
import {CreateCommentDTO} from './createCommentDTO';

export class UpdateCommentDTO extends PartialType(CreateCommentDTO) {}
