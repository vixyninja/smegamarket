import {PartialType} from '@nestjs/mapped-types';
import {CreateBrandDTO} from './createBrand.dto';

export class UpdateBrandDTO extends PartialType(CreateBrandDTO) {}
