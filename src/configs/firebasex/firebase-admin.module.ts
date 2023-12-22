import {Global, Module} from '@nestjs/common';
import {FIREBASE_ADMIN_PROVIDER, FIREBASE_ADMIN_NAME} from './constants';
import * as admin from 'firebase-admin';

var serviceAccount = require('../../../datasource/megamarket-9ae24-firebase-adminsdk-yieoo-d49c743b13.json');

@Global()
@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN_PROVIDER,
      useValue: admin.initializeApp(
        {
          credential: admin.credential.cert(serviceAccount),
        },
        FIREBASE_ADMIN_NAME,
      ),
    },
  ],
  exports: [FIREBASE_ADMIN_PROVIDER],
})
export class FirebaseAdminModule {}
