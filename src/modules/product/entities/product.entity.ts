import {BaseEntity} from '@/core';
import {BrandEntity} from '@/modules/brand';
import {CategoryEntity} from '@/modules/category';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from 'typeorm';

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
  @ManyToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true})
  brand: BrandEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.uuid, {cascade: true})
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
  categories: CategoryEntity[];

  @ManyToMany(() => MediaEntity, (media) => media.uuid, {cascade: true})
  @JoinTable({
    name: 'product_media',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_PRODUCT_MEDIA',
    },
    inverseJoinColumn: {
      name: 'mediaId',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_MEDIA_PRODUCT',
    },
  })
  media: MediaEntity[];
}
