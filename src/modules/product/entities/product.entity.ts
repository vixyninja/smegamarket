import {BaseEntity} from '@/core';
import {BrandEntity} from '@/modules/brand';
import {CategoryEntity} from '@/modules/category';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany} from 'typeorm';
import {ProductInformationEntity} from './product_information.entity';

@Entity({
  name: 'product',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: false, unique: true})
  name: string;

  @Column({type: 'text', nullable: true})
  description: string;

  @Column({type: 'varchar', array: true, nullable: true})
  detail: string[];

  @Column({type: 'varchar', length: 225, nullable: true})
  link: string;

  @JoinColumn({
    name: 'brandId',
    foreignKeyConstraintName: 'FK_PRODUCT_BRAND',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true, nullable: true})
  brand: BrandEntity;

  @JoinColumn({
    name: 'productInformationId',
    foreignKeyConstraintName: 'FK_PRODUCT_PRODUCT_INFORMATION',
    referencedColumnName: 'uuid',
  })
  @OneToMany(() => ProductInformationEntity, (productInformation) => productInformation.uuid, {
    cascade: true,
    nullable: true,
  })
  productInformation: ProductInformationEntity[];

  @JoinTable({
    name: 'product_category',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_PRODUCT_CATEGORY',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_CATEGORY_PRODUCT',
    },
  })
  @ManyToMany(() => CategoryEntity, (category) => category.uuid, {cascade: true, nullable: true})
  categories: CategoryEntity[];
}
