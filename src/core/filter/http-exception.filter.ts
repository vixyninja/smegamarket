import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(); // 1
    const response = ctx.getResponse<Response>(); // 2
    const request = ctx.getRequest<Request>(); // 3

    response.status(200).json({
      statusCode: exception.getStatus(),
      message: exception.message,
      data: {
        timestamp: new Date().toISOString(),
        request: request.method + ' ' + request.url,
        error: exception.name,
      },
    });
  }
}
