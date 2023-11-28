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
  @Column({type: 'varchar', length: 225, unique: true})
  name: string;

  @Column({type: 'varchar', length: 225, unique: true})
  description: string;

  @Column({type: 'varchar', length: 225, unique: true})
  address: string;

  @Column({type: 'varchar', length: 225, unique: true})
  phone: string;

  @Column({type: 'varchar', length: 225, unique: true})
  website: string;

  @Column({type: 'varchar', length: 225, unique: true})
  email: string;

  @JoinColumn({name: 'avatar', foreignKeyConstraintName: 'FK_BRAND_AVATAR', referencedColumnName: 'uuid'})
  @OneToOne(() => MediaEntity, {cascade: true, nullable: true})
  avatar: MediaEntity;
}
