import {Environment} from '@/configs/environments';
import {Injectable} from '@nestjs/common';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';

@Injectable()
export class PostgresDBService implements TypeOrmOptionsFactory {
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      host: Environment.POSTGRES_HOST,
      port: Environment.POSTGRES_PORT,
      username: Environment.POSTGRES_USER,
      password: Environment.POSTGRES_PASSWORD,
      database: Environment.POSTGRES_DB,
      ssl: true,
      type: 'postgres',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
      autoLoadEntities: true,
      keepConnectionAlive: true,
    };
  }
}
