import {Logger, RequestMethod} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import * as express from 'express';
import helmet from 'helmet';
import {join} from 'path';
import {AppModule} from './app.module';
import {FormatResponseInterceptor, HttpExceptionFilter, TimeoutInterceptor} from './core';
import {I18nValidationExceptionFilter, I18nValidationPipe} from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const prefix = 'api/v1';
  const port = process.env.PORT;

  app.use(helmet());

  app.enableCors();

  app.setGlobalPrefix(prefix, {
    exclude: [{path: 'health', method: RequestMethod.GET}],
  });

  app.use(express.static(join(__dirname, '..', 'public')));

  app.useGlobalPipes(
    new I18nValidationPipe({
      errorHttpStatusCode: 422,
    }),
  );

  app.useGlobalInterceptors(new TimeoutInterceptor(), new FormatResponseInterceptor());

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      errorHttpStatusCode: 422,
    }),
  );

  await app.listen(port);
}

bootstrap()
  .then(() =>
    Logger.verbose(`🌚 Application is listening on port ${process.env.PORT} , ${process.env.NODE_ENV} 👀 😈 `),
  )
  .catch((error) => Logger.error(error));
