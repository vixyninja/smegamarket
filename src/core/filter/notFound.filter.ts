import {HttpException, HttpStatus} from '@nestjs/common';
import * as TEXT from '../constants';

export class HttpNotFound extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
