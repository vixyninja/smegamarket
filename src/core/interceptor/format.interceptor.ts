import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Meta} from '../interface';

export interface Response<T> {
  statusCode: number;
  message: string;
  data?: T;
  meta?: Meta;
}

@Injectable()
export class FormatResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        if (res?.meta)
          return {
            statusCode: HttpStatus.OK,
            message: 'Response successfully',
            meta: res.meta,
            data: res.data || null,
          };

        return {
          statusCode: res?.status || HttpStatus.OK,
          message: res?.message || 'Response successfully',
          data: res?.data || null,
        };
      }),
    );
  }
}
