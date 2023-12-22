import {Inject, Injectable} from '@nestjs/common';
import * as admin from 'firebase-admin';
import {FcmPayload} from '../interfaces';
import {FIREBASE_ADMIN_PROVIDER} from '../constant';

@Injectable()
export class FirebaseMessagingService {
  constructor(@Inject(FIREBASE_ADMIN_PROVIDER) private readonly firebaseAdmin: admin.app.App) {}

  async sendToDevice(registrationToken: string, payload: FcmPayload, options?: admin.messaging.MessagingOptions) {
    return await this.firebaseAdmin.messaging().send({
      token: registrationToken,
      data: payload.data,
      notification: {
        body: payload.notification.body,
        imageUrl: payload.notification.image,
        title: payload.notification.title,
      },

      ...options,
    });
  }

  async sendToMultipleDevices(
    registrationTokens: string[],
    payload: FcmPayload,
    options?: admin.messaging.MessagingOptions,
  ) {
    return await this.firebaseAdmin.messaging().sendEachForMulticast({
      tokens: registrationTokens,
      data: payload.data,
      notification: {
        body: payload.notification.body,
        imageUrl: payload.notification.image,
        title: payload.notification.title,
      },
      ...options,
    });
  }

  async sendToTopic(topic: string, payload: FcmPayload, options?: admin.messaging.MessagingOptions) {
    return await this.firebaseAdmin.messaging().send({
      topic,
      data: payload.data,
      notification: {
        body: payload.notification.body,
        imageUrl: payload.notification.image,
        title: payload.notification.title,
      },
      ...options,
    });
  }

  async subscribeToTopic(registrationTokens: string[], topic: string) {
    return await this.firebaseAdmin.messaging().subscribeToTopic(registrationTokens, topic);
  }

  async unsubscribeFromTopic(registrationTokens: string[], topic: string) {
    return await this.firebaseAdmin.messaging().unsubscribeFromTopic(registrationTokens, topic);
  }

  async sendToCondition(condition: string, payload: FcmPayload, options?: admin.messaging.MessagingOptions) {
    return await this.firebaseAdmin.messaging().send({
      condition,
      data: payload.data,
      notification: {
        body: payload.notification.body,
        imageUrl: payload.notification.image,
        title: payload.notification.title,
      },
      ...options,
    });
  }

  async sendAll(payload: FcmPayload, options?: admin.messaging.MessagingOptions) {
    return await this.firebaseAdmin.messaging().sendEach([
      {
        condition: "''",
        data: payload.data,
        notification: {
          body: payload.notification.body,
          imageUrl: payload.notification.image,
          title: payload.notification.title,
        },
        ...options,
      },
    ]);
  }
}
