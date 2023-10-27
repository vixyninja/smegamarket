import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {Environment} from '../environments';

@Injectable()
export class PostgresDBService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      host: Environment.POSTGRES_HOST,
      port: Environment.POSTGRES_PORT,
      username: Environment.POSTGRES_USER,
      password: Environment.POSTGRES_PASSWORD,
      database: Environment.POSTGRES_DB,
      type: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
