import {Environment} from '@/configs/environments';
import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class PostgresProvider implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
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
      cache: true,
      connectTimeoutMS: 30000,
      uuidExtension: 'pgcrypto',
      verboseRetryLog: true,
      nativeDriver: true,
    };
  }
}
