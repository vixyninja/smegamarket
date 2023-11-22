import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const now = Date.now();
    const method = request.method;
    const url = request.url;
    const delay = Date.now() - now;

    Logger.warn(
      `${request.ip} ${new Date()} ${method} ${url}  ${request.statusCode} ${
        request.headers['user-agent']
      } *** ${request.headers.host.split(':')[1]} ${delay}ms`,
    );

    response.status(HttpStatus.OK).json({
      statusCode: status,
      message: exception.message,
      data: {
        name: exception.name,
        path: request.url,
      },
    });
  }
}
