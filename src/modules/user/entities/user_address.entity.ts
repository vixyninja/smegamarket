import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity({
  name: 'user_address',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserAddressEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  addressLine1: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  addressLine2: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  postalCode: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  country: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  city: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  phoneNumber: string;

  constructor(partial: Partial<UserAddressEntity>) {
    super();
    Object.assign(this, partial);
  }
}
