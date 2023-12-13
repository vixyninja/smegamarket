import {HttpException, HttpStatus} from '@nestjs/common';
import {CLIENT_ERROR_RESPONSES} from '../constants';

export class HttpForbidden extends HttpException {
  constructor(error?: any) {
    super(error || CLIENT_ERROR_RESPONSES.FORBIDDEN, HttpStatus.FORBIDDEN);
  }
}
