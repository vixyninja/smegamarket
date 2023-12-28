import {HttpException, HttpStatus} from '@nestjs/common';
import * as TEXT from '../constants';
export class HttpUnauthorized extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.CLIENT_ERROR_RESPONSES.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}
