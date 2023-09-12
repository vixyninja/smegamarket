import {HttpException, HttpStatus} from '@nestjs/common';
import * as TEXT from '../../constants';
export class HttpBadRequest extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
