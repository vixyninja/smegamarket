import {HttpException, HttpStatus} from '@nestjs/common';
import * as TEXT from '../constants';

export class HttpForbidden extends HttpException {
  constructor(error?: any) {
    super(error || TEXT.HTTP_FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
