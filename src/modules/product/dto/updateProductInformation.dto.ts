import {PartialType} from '@nestjs/mapped-types';
import {CreateProductInformationDTO} from './createProductInformation.dto';

export class UpdateProductInformationDTO extends PartialType(CreateProductInformationDTO) {}
