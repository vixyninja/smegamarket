import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column({type: 'varchar', length: 100, unique: true})
  name: string;

  @Column({type: 'varchar', length: 225, nullable: true})
  description: string;
}
