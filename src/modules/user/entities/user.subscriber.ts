import {generateSalt, hashPassword} from '@/core';
import {UserEntity} from '@/modules';
import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): string | Function {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void | Promise<any> {
    if (event.entity.password) {
      let salt: string = generateSalt();
      event.entity.salt = salt;
      event.entity.password = hashPassword(event.entity.password, salt);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void | Promise<any> {
    const entity = event.entity as UserEntity;

    if (entity.password !== event.databaseEntity.password) {
      let salt: string = generateSalt();
      entity.salt = salt;
      entity.password = hashPassword(entity.password, salt);
    }
  }
}
