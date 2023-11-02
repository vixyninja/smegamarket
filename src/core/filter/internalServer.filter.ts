import {HttpException, HttpStatus} from '@nestjs/common';
import * as TEXT from '../constants';

export class HttpInternalServerError extends HttpException {
  constructor(error?: any) {
    super(
      error || TEXT.HTTP_INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
