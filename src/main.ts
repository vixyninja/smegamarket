import {Logger} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import helmet from 'helmet';
import {AppModule} from './app.module';
import {HttpExceptionFilter, TimeoutInterceptor, ValidationPipe} from './core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.enableCors({
    origin: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'x-requested-with', 'Access-Control-Allow-Origin'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });
  app.setGlobalPrefix('v1');
  //global filter
  app.useGlobalFilters(new HttpExceptionFilter());
  //global pipe
  app.useGlobalPipes(new ValidationPipe());
  //global timeout
  app.useGlobalInterceptors(new TimeoutInterceptor());

  await app.listen(process.env.PORT);
}
bootstrap().then(() =>
  Logger.log(`🌚 🌚 Application is listening on port ${process.env.PORT} 👀 👀 , ${process.env.NODE_ENV} 😈 😈 😈 😈 `),
);
