import {BaseEntity} from '@/core';
import {Entity, JoinColumn, ManyToOne} from 'typeorm';
import {CategoryEntity} from '../category';
import {ProductEntity} from '.';

@Entity()
export class ProductCategory extends BaseEntity {
  @JoinColumn({
    name: 'productId',
    foreignKeyConstraintName: 'FK_product_category_productId',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => ProductEntity, (product) => product.uuid, {cascade: true})
  productId: string;

  @JoinColumn({
    name: 'categoryId',
    foreignKeyConstraintName: 'FK_product_category_categoryId',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => CategoryEntity, (category) => category.uuid, {cascade: true})
  categoryId: string;
}
