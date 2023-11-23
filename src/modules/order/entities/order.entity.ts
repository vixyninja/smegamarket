import {BaseEntity} from '@/core';
import {Entity} from 'typeorm';

@Entity({
  name: 'order',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class OrderEntity extends BaseEntity {}
