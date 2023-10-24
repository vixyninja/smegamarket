import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';

@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('REQUEST: ', request.method, request.url);
    console.log('RESPONSE: ', response.statusCode);
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log(`After... ${Date.now() - now}ms`);
        return next;
      }),
    );
  }
}
