import {BaseEntity} from '@/core';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn} from 'typeorm';

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

  @JoinColumn({name: 'icon', foreignKeyConstraintName: 'FK_CATEGORY_ICON', referencedColumnName: 'uuid'})
  icon: MediaEntity;
}
