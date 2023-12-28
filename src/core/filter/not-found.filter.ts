import {HttpException, HttpStatus} from '@nestjs/common';
import {CLIENT_ERROR_RESPONSES} from '../constants';

export class HttpNotFound extends HttpException {
  constructor(error?: any) {
    super(error || CLIENT_ERROR_RESPONSES.NOT_FOUND, HttpStatus.NOT_FOUND);
  }
}
