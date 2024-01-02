import {BaseEntity, RoleEnum} from '@/core';
import {Column, Entity, JoinColumn, OneToMany} from 'typeorm';
import {GalleryEntity} from './gallery.entity';

@Entity({
  name: 'product',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductEntity extends BaseEntity {
  @Column({name: 'product_name', type: 'varchar', length: 255, nullable: false, unique: true})
  productName: string;

  @Column({name: 'product_sku', type: 'varchar', length: 255, nullable: false, unique: true})
  SKU: string;

  @Column({name: 'product_regular_price', type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0})
  regularPrice: number;

  @Column({name: 'product_discount_price', type: 'decimal', precision: 10, scale: 2, nullable: false, default: 0})
  discountPrice: number;

  @Column({name: 'product_quantity', type: 'int', nullable: false, default: 0})
  quantity: number;

  @Column({name: 'product_short_description', type: 'text', nullable: true})
  shortDescription: string;

  @Column({name: 'product_description', type: 'text', nullable: true})
  productDescription: string;

  @Column({name: 'product_weight', type: 'numeric', nullable: false, default: 0})
  productWeight: number;

  @Column({name: 'product_note', type: 'text', nullable: true})
  productNote: string;

  @Column({name: 'product_published', type: 'boolean', nullable: false, default: false})
  published: boolean;

  @Column({name: 'created_by', nullable: false, type: 'varchar', length: 225, default: RoleEnum.ADMIN})
  createdBy: string;

  @Column({name: 'updated_by', nullable: false, type: 'varchar', length: 225, default: RoleEnum.ADMIN})
  updatedBy: string;

  // * RELATIONS

  @JoinColumn({foreignKeyConstraintName: 'FK_PRODUCT_GALLERY'})
  @OneToMany(() => GalleryEntity, (gallery) => gallery.product, {lazy: true})
  gallery: GalleryEntity[];

  // * RELATIONS

  constructor(partial: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
