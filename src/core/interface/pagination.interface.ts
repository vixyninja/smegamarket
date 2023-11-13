export interface IQueryOptions {
  _page?: number;
  _limit?: number;
  _sort?: string;
  _order?: 'ASC' | 'DESC';
}

export class Meta {
  page: number;
  limit: number;
  total: number;
  total_page: number;
  query?: IQueryOptions;
  constructor(page: number, limit: number, total: number, total_page: number, query?: IQueryOptions) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.total_page = total_page;
    this.query = query;
  }
}
