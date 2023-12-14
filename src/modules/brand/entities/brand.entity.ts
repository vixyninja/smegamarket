import {BaseEntity} from '@/core';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';

@Entity({
  name: 'brand',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class BrandEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, unique: true, nullable: false})
  name: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  description: string;

  @Column({type: 'varchar', length: 225, unique: true, nullable: true, default: null})
  address: string;

  @Column({type: 'varchar', length: 225, unique: true})
  phone: string;

  @Column({type: 'varchar', length: 225, unique: true, nullable: true, default: null})
  website: string;

  @Column({type: 'varchar', length: 225, unique: true})
  email: string;

  @JoinColumn({name: 'avatar_uuid', foreignKeyConstraintName: 'FK_BRAND_AVATAR', referencedColumnName: 'uuid'})
  @OneToOne(() => MediaEntity, (media) => media.uuid, {cascade: true, nullable: true})
  avatar: MediaEntity;
}
