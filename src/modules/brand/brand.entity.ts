import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';
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

  @JoinColumn({
    name: 'imageId',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_brand_image',
  })
  @OneToOne(() => FileEntity, (file) => file.uuid, {cascade: true})
  imageId: string;
}