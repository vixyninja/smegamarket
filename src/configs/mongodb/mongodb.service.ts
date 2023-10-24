import {Injectable} from '@nestjs/common';
import {MongooseModuleOptions, MongooseOptionsFactory} from '@nestjs/mongoose';
import {Environment} from '../environments';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: Environment.MONGO_URL,
      appName: Environment.MONGO_INITDB_DATABASE,
      auth: {
        username: Environment.MONGO_INITDB_ROOT_USERNAME,
        password: Environment.MONGO_INITDB_ROOT_PASSWORD,
      },
      connectTimeoutMS: 10000,
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
