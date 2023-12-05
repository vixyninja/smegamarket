import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PostgresProvider} from './postgresdb.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: PostgresProvider,
      inject: [PostgresProvider],
    }),
  ],
  providers: [
    {
      provide: 'POSTGRES_PROVIDER',
      useClass: PostgresProvider,
    },
  ],
  exports: [TypeOrmModule, 'POSTGRES_PROVIDER'],
})
export class PostgresDBModule {}
