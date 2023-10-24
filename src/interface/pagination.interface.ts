import {HttpResponse} from './common.interface';

export interface IQueryOptions {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: string;
}

export interface IPagination<T> {
  page: number;
  limit: number;
  total: number;
  total_page: number;
  data: T[];
}

export class HttpPagination<T> extends HttpResponse<T> implements IPagination<T> {
  page: number;
  limit: number;
  total: number;
  total_page: number;
  data: T[];
  message: string;
  statusCode: number;
  constructor(
    statusCode: number,
    data: T[],
    message: string,
    page: number,
    limit: number,
    total: number,
    total_page: number,
  ) {
    super(statusCode, data, message);
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.total_page = total_page;
  }
}
