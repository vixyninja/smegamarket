import {PartialType} from '@nestjs/mapped-types';
import {CreateLinkDTO} from './createLinkDTO';

export class UpdateLinkDTO extends PartialType(CreateLinkDTO) {}
