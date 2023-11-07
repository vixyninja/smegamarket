import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column({type: 'varchar', length: 50, unique: true})
  name: string;

  @Column({type: 'varchar', length: 100, nullable: true})
  description: string;
}
