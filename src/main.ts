import {HttpStatus, Logger, RequestMethod} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import * as express from 'express';
import helmet from 'helmet';
import {I18nValidationExceptionFilter, I18nValidationPipe} from 'nestjs-i18n';
import {join} from 'path';
import {AppModule} from './app.module';
import {CLIENT_ERROR_RESPONSES, FormatResponseInterceptor, HttpExceptionFilter, TimeoutInterceptor} from './core';

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

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new I18nValidationExceptionFilter({
      detailedErrors: false,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      responseBodyFormatter(host, exc, formattedErrors) {
        return {
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: CLIENT_ERROR_RESPONSES.UNPROCESSABLE_ENTITY,
          errors: formattedErrors,
        };
      },
    }),
  );
  app.useGlobalInterceptors(new TimeoutInterceptor(), new FormatResponseInterceptor());
  app.useGlobalPipes(
    new I18nValidationPipe({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  );
  await app.listen(port);
}

bootstrap()
  .then(() =>
    Logger.verbose(`🌚 Application is listening on port ${process.env.PORT} , ${process.env.NODE_ENV} 👀 😈 `),
  )
  .catch((error) => Logger.error(error));
