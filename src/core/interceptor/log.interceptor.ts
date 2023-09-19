import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('REQUEST: ', request.method, request.url);
    console.log('RESPONSE: ', response.statusCode);

    return next.handle();
  }
}