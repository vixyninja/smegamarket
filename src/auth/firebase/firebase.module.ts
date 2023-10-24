import {Module} from '@nestjs/common';

import {JwtModule, JwtService} from '@nestjs/jwt';
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseApp from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';

import {FirebaseAuthStrategy} from './firebase-strategy.strategy';
import {Environment} from '@/configs';

const firebaseConfig: firebaseApp.FirebaseOptions = {
  apiKey: Environment.FIREBASE_API_KEY,
  authDomain: Environment.FIREBASE_AUTH_DOMAIN,
  projectId: Environment.FIREBASE_PROJECT_ID,
  appId: Environment.FIREBASE_APP_ID,
  measurementId: Environment.FIREBASE_MEASUREMENT_ID,
  messagingSenderId: Environment.FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: Environment.FIREBASE_STORAGE_BUCKET,
};
@Module({
  imports: [
    JwtModule.register({
      secret: Environment.APP_SECRET.replace(/\\n/g, '\n'),
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
            clientEmail: Environment.FIREBASE_ADMIN_CLIENT_EMAIL,
            privateKey: Environment.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            projectId: Environment.FIREBASE_PROJECT_ID,
          }),
          storageBucket: Environment.FIREBASE_STORAGE_BUCKET,
          databaseURL: `https://${Environment.FIREBASE_PROJECT_ID}.firebaseio.com`,
          projectId: Environment.FIREBASE_PROJECT_ID,
          serviceAccountId: Environment.FIREBASE_ADMIN_CLIENT_EMAIL,
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
