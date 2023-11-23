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
    name: 'avatar',
    foreignKeyConstraintName: 'FK_BRAND_AVATAR',
    referencedColumnName: 'uuid',
  })
  @OneToOne(() => FileEntity, (file) => file.uuid, {cascade: true})
  avatar: FileEntity;
}
