import {BaseEntity} from '@/core';
import {FileEntity} from '@/modules/file';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';

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
  @ManyToOne(() => FileEntity, (file) => file.uuid, {cascade: true, nullable: true})
  avatar: FileEntity;
}
