import {Logger, RequestMethod} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as express from 'express';
import helmet from 'helmet';
import {join} from 'path';
import {AppModule} from './app.module';
import {FormatResponseInterceptor, HttpExceptionFilter, TimeoutInterceptor, ValidationPipe} from './core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const prefix = 'api/v1';
  const port = process.env.PORT;
  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix(prefix, {
    exclude: [{path: 'health', method: RequestMethod.GET}],
  });
  app.use(express.static(join(__dirname, '..', 'public')));

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TimeoutInterceptor(), new FormatResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}

bootstrap()
  .then(() =>
    Logger.verbose(`🌚 Application is listening on port ${process.env.PORT} , ${process.env.NODE_ENV} 👀 😈 `),
  )
  .catch((error) => Logger.error(error));
