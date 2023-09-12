import {Module} from '@nestjs/common';

import {JwtModule, JwtService} from '@nestjs/jwt';
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import {
  APP_SECRET,
  FIREBASE_ADMIN_CLIENT_EMAIL,
  FIREBASE_API_KEY,
  FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_MEASUREMENT_ID,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PRIVATE_KEY,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
} from 'src/configs';
import {FirebaseAuthStrategy} from './firebase-strategy.strategy';

const firebaseConfig: firebaseApp.FirebaseOptions = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
};
@Module({
  imports: [
    JwtModule.register({
      secret: APP_SECRET.replace(/\\n/g, '\n'),
    }),
  ],
  providers: [
    {
      provide: 'FirebaseApp',
      useFactory: () => firebaseApp.initializeApp(firebaseConfig),
    },
    {
      provide: 'FirebaseAuth',
      useFactory: (firebaseApp: firebaseApp.FirebaseApp) => {
        const configFirebaseAuth: firebaseAuth.Auth = firebaseAuth.getAuth(firebaseApp);
        configFirebaseAuth.languageCode = 'vi';
        return configFirebaseAuth;
      },
      inject: ['FirebaseApp'],
    },
    {
      provide: 'FirebaseAdmin',
      useFactory: () => {
        const configFirebaseAdmin: firebaseAdmin.app.App = firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            projectId: FIREBASE_PROJECT_ID,
          }),
          storageBucket: FIREBASE_STORAGE_BUCKET,
          databaseURL: `https://${FIREBASE_PROJECT_ID}.firebaseio.com`,
          projectId: FIREBASE_PROJECT_ID,
          serviceAccountId: FIREBASE_ADMIN_CLIENT_EMAIL,
        });
        return configFirebaseAdmin;
      },
      inject: ['FirebaseApp'],
    },
    FirebaseAuthStrategy,
    JwtService,
  ],
  exports: [FirebaseAuthStrategy, JwtService, 'FirebaseAuth', 'FirebaseAdmin'],
})
export class FireBaseModule {}
