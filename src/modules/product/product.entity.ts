import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne} from 'typeorm';
import {BrandEntity} from '../brand';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from './enum';
import {CategoryEntity} from '../category';
import {FileEntity} from '../file';

@Entity()
export class ProductEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: false, unique: true})
  name: string;

  @Column({type: 'numeric', nullable: false})
  price: number;

  @Column({type: 'enum', enum: ProductEnum, default: ProductEnum.Etc})
  type: ProductEnum;

  @Column({type: 'enum', enum: StatusEnum, default: StatusEnum.Active})
  status: StatusEnum;

  @Column({type: 'enum', enum: SizeEnum, default: SizeEnum.Medium})
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
    foreignKeyConstraintName: 'FK_product_brand_id',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true})
  brand: BrandEntity;

  @ManyToMany(() => CategoryEntity, (category) => category.uuid, {cascade: true})
  @JoinTable({
    name: 'product_category',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_product_category',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_category_product',
    },
  })
  category: CategoryEntity[];

  @ManyToMany(() => FileEntity, (file) => file.uuid, {cascade: true})
  @JoinTable({
    name: 'product_image',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_product_image',
    },
    inverseJoinColumn: {
      name: 'image_id',
      referencedColumnName: 'uuid',
      foreignKeyConstraintName: 'FK_image_product',
    },
  })
  images: FileEntity[];
}
