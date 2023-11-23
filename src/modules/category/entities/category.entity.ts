import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity({
  name: 'category',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class CategoryEntity extends BaseEntity {
  @Column({type: 'varchar', length: 100, unique: true})
  name: string;

  @Column({type: 'varchar', length: 225, nullable: true})
  description: string;
}
