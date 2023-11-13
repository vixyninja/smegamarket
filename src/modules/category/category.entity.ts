import {BaseEntity} from '@/core';
import {Column, Entity, JoinTable, ManyToMany} from 'typeorm';
import {FileEntity} from '../file';

@Entity()
export class CategoryEntity extends BaseEntity {
  @Column({type: 'varchar', length: 100, unique: true})
  name: string;

  @Column({type: 'varchar', length: 225, nullable: true})
  description: string;

  @ManyToMany(() => FileEntity, (file) => file.uuid, {nullable: true, cascade: true})
  @JoinTable({
    synchronize: true,
    name: 'category_image',
    joinColumn: {
      name: 'category_id',
      referencedColumnName: 'uuid',
    },
    inverseJoinColumn: {
      name: 'image_id',
      referencedColumnName: 'uuid',
    },
  })
  imageId: string;
}
