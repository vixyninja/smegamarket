import {BaseEntity} from '@/core';
import {UserEntity} from '@/modules/user';
import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';

@Entity({
  name: 'cart',
  orderBy: {
    createdAt: 'DESC',
  },
})
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
