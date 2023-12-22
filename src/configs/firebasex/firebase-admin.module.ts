import {Module} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {FIREBASE_ADMIN_NAME, FIREBASE_ADMIN_PROVIDER} from './constant';

var serviceAccount = require('../../../datasource/megamarket-9ae24-firebase-adminsdk-yieoo-d49c743b13.json');

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
  exports: [],
})
export class FirebaseAdminModule {}
