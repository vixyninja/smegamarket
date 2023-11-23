import {CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor} from '@nestjs/common';
import {Observable, tap} from 'rxjs';

@Injectable()
export class LogsInterceptor implements NestInterceptor {
  constructor() {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const method = req.method;
    const url = req.url;
    const res = context.switchToHttp().getResponse();
    const delay = Date.now() - now;
    Logger.debug(
      `${req.ip} ${new Date()} ${method} ${url} ${req.protocol} ${res.statusCode} ${
        req.headers['content-length'] || '0'
      } *** ${req.headers.host.split(':')[1]} ${delay}ms`,
    );
    return next.handle();
  }
}
