import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne} from 'typeorm';
import {FileEntity} from '../file';

@Entity()
export class BrandEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, unique: true})
  name: string;

  @Column({type: 'varchar', length: 225, unique: true})
  description: string;

  @Column({type: 'varchar', length: 225, unique: true})
  address: string;

  @Column({type: 'varchar', length: 225, unique: true})
  phoneNumber: string;

  @Column({type: 'varchar', length: 225, unique: true})
  website: string;

  @Column({type: 'varchar', length: 225, unique: true})
  email: string;

  @ManyToMany(() => FileEntity, (file) => file.uuid, {cascade: true})
  @JoinTable({
    name: 'brand_image',
    joinColumn: {
      name: 'brandId',
      referencedColumnName: 'uuid',
    },
    inverseJoinColumn: {
      name: 'imageId',
      referencedColumnName: 'uuid',
    },
  })
  imageId: string;
}
