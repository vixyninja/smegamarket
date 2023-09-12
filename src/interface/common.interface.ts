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

export interface IPagination {
  page: number;
  limit: number;
  total: number;
  total_page: number;
}

export interface IHttpResponsePagination<T> extends IHttpResponse<T>, IPagination {}

export class HttpResponsePagination<T> implements IHttpResponsePagination<T> {
  statusCode: number;
  data: T | T[];
  message: string;
  page: number;
  limit: number;
  total: number;
  total_page: number;
  constructor(
    statusCode: number,
    data: T | T[],
    message: string,
    page: number,
    limit: number,
    total: number,
    total_page: number,
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.total_page = total_page;
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
