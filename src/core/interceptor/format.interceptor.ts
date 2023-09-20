import {CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus} from '@nestjs/common';
import {map, Observable} from 'rxjs';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    context.switchToHttp().getResponse().status(HttpStatus.OK);
    return next.handle().pipe(map((value) => value));
  }
}
