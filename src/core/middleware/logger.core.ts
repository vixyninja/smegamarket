import {Injectable, Logger as LogCore, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';

@Injectable()
export class Logger implements NestMiddleware {
  private logger = new LogCore('HTTP');
  use(req: Request, res: Response, next: NextFunction): void {
    const userAgent = req.get('user-agent') || '';
    res.on('close', () => {
      this.logger.warn(`${req.method} ${req.originalUrl} ${new Date().toISOString()}`);
      this.logger.debug(`${userAgent} `);
    });
    next();
  }
}
