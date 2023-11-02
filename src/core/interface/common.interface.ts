import {HttpStatus} from '@nestjs/common';

export interface IHttpResponse<T> {
  statusCode: number;
  data?: T | T[];
  message: string;
}

export class HttpResponse<T> implements IHttpResponse<T> {
  statusCode: number;
  data: T | T[];
  message: string;
  constructor(statusCode: number, data: T | T[], message: string) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }
}

export class HttpSuccessResponse<T> extends HttpResponse<T> {
  constructor(data: T | T[], message: string) {
    super(HttpStatus.OK, data, message);
  }
}

export class HttpCreatedResponse<T> extends HttpResponse<T> {
  constructor(data: T | T[], message: string) {
    super(HttpStatus.CREATED, data, message);
  }
}

export class HttpOk implements Omit<IHttpResponse<{}>, 'data'> {
  statusCode: number;
  message: string;
  constructor(message: string) {
    this.statusCode = HttpStatus.OK;
    this.message = message;
  }
}
