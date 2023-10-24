import {Global, Logger, Module} from '@nestjs/common';
import {TypeOrmModule, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {Environment} from '../environments';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (options: TypeOrmOptionsFactory) => {
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
          applicationName: Environment.SERVER_NAME,
        };
      },
      name: 'postgres',
    }),
  ],
})
export class PostgresDBModule {}
