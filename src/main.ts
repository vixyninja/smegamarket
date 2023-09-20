import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {
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
  app.use(helmet());
  app.enableCors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'Access-Control-Allow-Origin'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    maxAge: 3600,
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  });
  app.setGlobalPrefix('v1');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TimeoutInterceptor(), new FormatResponseInterceptor(), new LogsInterceptor());
  await app.listen(process.env.PORT);
}
bootstrap().then(() =>
  Logger.debug(
    `🌚 🌚 Application is listening on port ${process.env.PORT} 👀 👀 , ${process.env.NODE_ENV} 😈 😈 😈 😈 `,
  ),
);
