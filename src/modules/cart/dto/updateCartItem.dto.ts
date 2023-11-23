import {PartialType} from '@nestjs/mapped-types';
import {CreateCartItemDTO} from './createCartItem.dto';

export class UpdateCartItemDTO extends PartialType(CreateCartItemDTO) {}
