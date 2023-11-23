import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne} from 'typeorm';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from '../enum';
import {BrandEntity} from '@/modules/brand';
import {CategoryEntity} from '@/modules/category';
import {FileEntity} from '@/modules/file';

@Entity({
  name: 'product',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: false, unique: true})
  name: string;

  @Column({type: 'numeric', nullable: false})
  price: number;

  @Column({type: 'enum', enum: ProductEnum, default: ProductEnum.Etc})
  type: ProductEnum;

  @Column({type: 'enum', enum: StatusEnum, default: StatusEnum.Active})
  status: StatusEnum;

  @Column({type: 'enum', enum: SizeEnum, default: SizeEnum.None})
  size: SizeEnum;

  @Column({type: 'varchar', nullable: true})
  detail: string;

  @Column({type: 'varchar', length: 225, nullable: true})
  benefit: string;

  @Column({type: 'varchar', length: 225, nullable: true})
  caution: string;

  @Column({type: 'enum', enum: SaleEnum, default: SaleEnum.None})
  sale: SaleEnum;

  @Column({type: 'varchar', length: 225, nullable: true})
  link: string;

  @JoinColumn({
    name: 'brandId',
    foreignKeyConstraintName: 'FK_PRODUCT_BRAND',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true})
  brand: BrandEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.uuid, {
    cascade: true,
  })
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
  category: CategoryEntity[];

  @ManyToMany(() => FileEntity, (file) => file.uuid, {cascade: true})
  @JoinTable({
    name: 'product_image',
    joinColumn: {
      name: 'productId',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_PRODUCT_IMAGE',
    },
    inverseJoinColumn: {
      name: 'imageId',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_IMAGE_PRODUCT',
    },
  })
  images: FileEntity[];
}
