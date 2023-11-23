import {ArgumentMetadata, Injectable, PipeTransform} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import {ValidationError, validate} from 'class-validator';
import {HttpBadRequest} from '../filter';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, {metatype}: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors: ValidationError[] = await validate(object);
    if (errors.length > 0) {
      throw new HttpBadRequest(errors[0].constraints[Object.keys(errors[0].constraints)[0]]);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
