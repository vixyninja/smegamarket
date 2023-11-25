import {Transform} from 'class-transformer';
import {IsOptional, isBoolean} from 'class-validator';

export class Meta {
  page: number;
  limit: number;
  total: number;
  total_page: number;
  query?: QueryOptions;
  constructor(page: number, limit: number, total: number, total_page: number, query?: QueryOptions) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.total_page = total_page;
    this.query = query;
  }
}

export class QueryOptions {
  @IsOptional()
  _page: number;

  @IsOptional()
  _limit: number;

  @IsOptional()
  _sort: string;

  @Transform((value) => value.value.toUpperCase())
  _order: string;

  static initialize(query: QueryOptions): QueryOptions {
    const {_page, _limit, _sort, _order} = query;

    var sort: string, order: string;
    var page: number, limit: number;

    if (_sort.trim() === '' || _sort.trim() === undefined || _sort.trim() === null) {
      sort = 'createdAt';
    } else {
      if (_sort.toString().trim() === 'updatedAt') {
        sort = _sort;
      } else {
        sort = 'createdAt';
      }
    }

    if (_order.trim() === '' || _order.trim() === undefined || _order.trim() === null) {
      order = 'ASC';
    } else {
      if (_order.toString().trim().toUpperCase() === 'DESC') {
        order = _order;
      } else {
        order = 'ASC';
      }
    }

    order = order.trim().toUpperCase();

    Number(_page) ? (page = Number(_page)) : (page = 1);
    Number(_limit) ? (limit = Number(_limit)) : (limit = 10);

    return {
      _page: page,
      _limit: limit,
      _sort: sort,
      _order: order,
    };
  }
}
