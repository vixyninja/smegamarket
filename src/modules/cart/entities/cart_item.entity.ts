import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {CartEntity} from './cart.entity';
import {ProductEntity, ProductSizeEnum} from '@/modules/product';
import {BaseEntity} from '@/core';

@Entity({
  name: 'cart_item',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class CartItemEntity extends BaseEntity {
  @JoinColumn({
    name: 'cartId',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_CART_ITEM_CART',
  })
  @ManyToOne(() => CartEntity, (cart) => cart.uuid, {cascade: true})
  cart: CartEntity;

  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_CART_ITEM_PRODUCT',
  })
  @OneToOne(() => CartEntity, (cart) => cart.uuid, {cascade: true})
  product: ProductEntity;

  @Column({type: 'numeric', nullable: false, default: 0})
  quantity: number;

  @Column({type: 'enum', enum: ProductSizeEnum, default: ProductSizeEnum.None, nullable: false})
  size: ProductSizeEnum;

  @Column({type: 'numeric', nullable: false, default: 0})
  price: number;

  @Column({type: 'varchar', length: 225, nullable: true})
  brandId: string;
}
