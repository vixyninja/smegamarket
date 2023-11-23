import {BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {ProductEntity, SizeEnum, StatusEnum} from '../../product';
import {CartEntity} from './cart.entity';

@Entity()
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

  @Column({type: 'enum', enum: SizeEnum, default: SizeEnum.None, nullable: false})
  size: SizeEnum;

  @Column({type: 'numeric', nullable: false, default: 0})
  price: number;

  @Column({type: 'varchar', length: 225, nullable: true})
  brandId: string;
}
