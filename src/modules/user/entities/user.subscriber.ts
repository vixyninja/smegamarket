import {UserEntity} from '@/modules';
import {EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent} from 'typeorm';
import {hashPassword} from '../../../core/utils';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
  listenTo(): string | Function {
    return UserEntity;
  }

  beforeInsert(event: InsertEvent<UserEntity>): void | Promise<any> {
    if (event.entity.password) {
      event.entity.password = hashPassword(event.entity.password);
    }
  }

  beforeUpdate(event: UpdateEvent<UserEntity>): void | Promise<any> {
    const entity = event.entity as UserEntity;

    if (entity.password !== event.databaseEntity.password) {
      entity.password = hashPassword(entity.password);
    }
  }
}
