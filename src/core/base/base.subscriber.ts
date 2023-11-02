import {
  BaseEntity,
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  LoadEvent,
  RecoverEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';

@EventSubscriber()
export class BaseEventSubscriber<T extends BaseEntity>
  implements EntitySubscriberInterface<T>
{
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  afterInsert(event: InsertEvent<T>): void | Promise<any> {
    console.log('After Insert: ' + event);
  }

  afterLoad(entity: T, event?: LoadEvent<T>): void | Promise<any> {
    console.log('After Load: ' + entity + ' | ' + event);
  }

  afterRecover(event: RecoverEvent<T>): void | Promise<any> {
    console.log('After Recover: ' + event);
  }

  afterRemove(event: RemoveEvent<T>): void | Promise<any> {
    console.log('After Remove: ' + event);
  }

  afterUpdate(event: UpdateEvent<T>): void | Promise<any> {
    console.log('After Update: ' + event);
  }

  listenTo(): string | Function {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<T>): void | Promise<any> {
    console.log('Before Insert: ' + event);
  }

  beforeUpdate(event: UpdateEvent<T>): void | Promise<any> {
    console.log('Before Update: ' + event);
  }

  beforeRemove(event: RemoveEvent<T>): void | Promise<any> {
    console.log('Before Remove:' + event);
  }
}
