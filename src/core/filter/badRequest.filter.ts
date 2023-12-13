import {HttpException, HttpStatus} from '@nestjs/common';
import {CLIENT_ERROR_RESPONSES} from '../constants';
export class HttpBadRequest extends HttpException {
  constructor(error?: any) {
    super(error || CLIENT_ERROR_RESPONSES.BAD_REQUEST, HttpStatus.BAD_REQUEST);
  }
}
