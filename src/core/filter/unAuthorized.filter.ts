import {HttpException, HttpStatus} from '@nestjs/common';
import * as TEXT from '../constants';
export class HttpUnauthorized extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
