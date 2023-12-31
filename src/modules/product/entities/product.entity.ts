import {BaseEntity} from '@/core';
import {Entity} from 'typeorm';

@Entity({
  name: 'product',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductEntity extends BaseEntity {}
