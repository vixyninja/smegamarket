import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {
  ErrorsInterceptor,
  FormatResponseInterceptor,
  HttpExceptionFilter,
  LogsInterceptor,
  TimeoutInterceptor,
  ValidationPipe,
} from './core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    cors: true,
    bufferLogs: true,
    snapshot: true,
  });

  const prefix = 'api/v1';
  const port = process.env.PORT;

  app.use(helmet());

  app.enableCors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'Access-Control-Allow-Origin'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 3600,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });
  app.setGlobalPrefix(prefix);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(
    new TimeoutInterceptor(),
    new ErrorsInterceptor(),
    new LogsInterceptor(),
    new FormatResponseInterceptor(),
  );

  await app.listen(port);
}
bootstrap().then(() =>
  Logger.debug(
    `🌚 🌚 Application is listening on port ${process.env.PORT} 👀 👀 , ${process.env.NODE_ENV} 😈 😈 😈 😈 `,
  ),
);
