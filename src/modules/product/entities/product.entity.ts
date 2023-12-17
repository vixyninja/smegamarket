import {BaseEntity} from '@/core';
import {BrandEntity} from '@/modules/brand';
import {CategoryEntity} from '@/modules/category';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne} from 'typeorm';
import {ProductInformationEntity} from './product_information.entity';
import {MediaEntity} from '@/modules/media';

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

  @ManyToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true, nullable: true})
  @JoinColumn({
    name: 'brand_uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_BRAND',
    referencedColumnName: 'uuid',
  })
  brand: BrandEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.uuid, {cascade: true, nullable: false})
  @JoinTable({
    name: 'product_categories',
    joinColumn: {
      name: 'product_uuid',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_PRODUCT_CATEGORY',
    },
    inverseJoinColumn: {
      name: 'category_uuid',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_CATEGORY_PRODUCT',
    },
  })
  categories: CategoryEntity[];

  @OneToOne(() => MediaEntity, (media) => media.uuid, {cascade: true, nullable: true})
  @JoinColumn({
    name: 'media_uuid',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_MEDIA',
  })
  media: MediaEntity;

  @OneToMany(() => ProductInformationEntity, (productInformation) => productInformation.uuid, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({
    name: 'product_information_uuid',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_PRODUCT_INFORMATION',
  })
  productInformation: ProductInformationEntity[];

  constructor(partial: Partial<ProductEntity>) {
    super();
    Object.assign(this, partial);
  }
}
