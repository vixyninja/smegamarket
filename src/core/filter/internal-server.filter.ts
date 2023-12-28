import {HttpException, HttpStatus} from '@nestjs/common';
import {SERVER_ERROR_RESPONSES} from '../constants';

export class HttpInternalServerError extends HttpException {
  constructor(error?: any) {
    super(error || SERVER_ERROR_RESPONSES.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
