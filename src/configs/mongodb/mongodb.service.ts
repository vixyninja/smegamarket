import {Injectable} from '@nestjs/common';
import {MongooseModuleOptions, MongooseOptionsFactory} from '@nestjs/mongoose';
import {
  MONGO_INITDB_DATABASE,
  MONGO_INITDB_ROOT_PASSWORD,
  MONGO_INITDB_ROOT_USERNAME,
  MONGO_URL,
} from '../environments';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: MONGO_URL,
      appName: MONGO_INITDB_DATABASE,
      auth: {
        username: MONGO_INITDB_ROOT_USERNAME,
        password: MONGO_INITDB_ROOT_PASSWORD,
      },
      connectTimeoutMS: 10000,
      lazyConnection: true,
      dbName: MONGO_INITDB_DATABASE,
      retryAttempts: 3,
      connectionFactory: (connection) => {
        connection.plugin(require('mongoose-autopopulate'));
        return connection;
      },
      connectionErrorFactory: (error) => {
        console.log('ERROR MONGODB CONNECTION', error);
        return error;
      },
      checkServerIdentity(hostname, cert) {
        console.log('hostname', hostname);
        return undefined;
      },
    };
  }
}
