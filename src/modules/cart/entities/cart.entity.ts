import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, JoinTable, OneToOne} from 'typeorm';
import {UserEntity} from '../../user';

@Entity()
export class CartEntity extends BaseEntity {
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_CART_USER',
  })
  @OneToOne(() => UserEntity, (user) => user.uuid, {cascade: true})
  user: UserEntity;

  @Column({type: 'numeric', nullable: false, default: 0})
  totalPrice: number;
}
