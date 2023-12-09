import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';
import {AppModule} from './app.module';
import * as express from 'express';
import {
  FormatResponseInterceptor,
  HttpExceptionFilter,
  LogsInterceptor,
  StatusInterceptor,
  TimeoutInterceptor,
  ValidationPipe,
} from './core';
import {join} from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = 'api/v1';
  const port = process.env.PORT;

  app.use(helmet());

  app.enableCors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Access-Control-Allow-Origin'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 3600,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });

  app.setGlobalPrefix(prefix);

  app.use(express.static(join(__dirname, '..', 'public')));

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(
    new LogsInterceptor(),
    new TimeoutInterceptor(),
    new FormatResponseInterceptor(),
    new StatusInterceptor(),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(port);
}

bootstrap()
  .then(() =>
    Logger.verbose(`🌚 Application is listening on port ${process.env.PORT} , ${process.env.NODE_ENV} 👀 😈 `),
  )
  .catch((error) => Logger.error(error));
