import {Request, Response, NextFunction} from 'express';
import {Injectable, Logger, NestMiddleware} from '@nestjs/common';

@Injectable()
export class LoggersMiddleware implements NestMiddleware {
  private logger = new Logger('RESTFUL API');

  use(req: Request, res: Response, next: NextFunction) {
    const {ip, method, originalUrl} = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const {statusCode} = res;
      this.logger.fatal(`${method} ${statusCode} - ${originalUrl} - ${ip} - ${userAgent}`);
    });
    next();
  }
}
