import {Environment} from '@/configs/environments';
import {Injectable} from '@nestjs/common';
import {MongooseModuleOptions, MongooseOptionsFactory} from '@nestjs/mongoose';

@Injectable()
export class MongooseProvider implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: Environment.MONGO_URL,
      auth: {
        username: Environment.MONGO_INITDB_ROOT_USERNAME,
        password: Environment.MONGO_INITDB_ROOT_PASSWORD,
      },
      dbName: Environment.MONGO_INITDB_DATABASE,
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
      connectionErrorFactory: (error) => {
        console.log('ERROR MONGODB CONNECTION', error);
        return error;
      },
    };
  }
}
