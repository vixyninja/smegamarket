import {BaseEntity} from '@/core';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';

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

  @JoinColumn({name: 'icon_uuid', foreignKeyConstraintName: 'FK_CATEGORY_ICON', referencedColumnName: 'uuid'})
  @ManyToOne(() => MediaEntity, (media) => media.uuid, {nullable: true, cascade: true})
  icon: MediaEntity;
}
