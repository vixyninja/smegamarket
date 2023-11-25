import {BaseEntity} from '@/core';
import {FileEntity} from '@/modules/file';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

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

  @JoinColumn({
    name: 'icon',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_CATEGORY_ICON',
  })
  @ManyToOne(() => FileEntity, (file) => file.uuid, {cascade: true, nullable: true})
  icon: FileEntity;
}
