import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import {BrandEntity} from '../brand';

export enum ProductEnum {
  'Vegetable' = 'Vegetable',
  'Fruit' = 'Fruit',
  'Meat' = 'Meat',
  'Fish' = 'Fish',
  'Etc' = 'Etc',
}

export enum StatusEnum {
  'Active' = 'Active',
  'Inactive' = 'Inactive',
  'Deleted' = 'Deleted',
}

export enum SizeEnum {
  'Small' = 'Small',
  'Medium' = 'Medium',
  'Large' = 'Large',
}

export enum SaleEnum {
  'Not Sale' = 'Not Sale',
  'One' = '5',
  'Two' = '10',
  'Three' = '15',
}

@Entity()
export class ProductEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: false})
  name: string;

  @Column({type: 'numeric', length: 225, nullable: false})
  price: number;

  @Column({type: 'enum', enum: ProductEnum, default: ProductEnum.Etc})
  type: ProductEnum;

  @Column({type: 'enum', enum: StatusEnum, default: StatusEnum.Active})
  status: StatusEnum;

  @Column({type: 'enum', enum: SizeEnum, default: SizeEnum.Medium})
  size: SizeEnum;

  @Column({type: 'array', length: 225, nullable: true})
  detail: string[];

  @Column({type: 'varchar', length: 225, nullable: true})
  benefit: string;

  @Column({type: 'varchar', length: 225, nullable: true})
  caution: string;

  @Column({type: 'enum', length: 225, enum: SaleEnum, default: SaleEnum['Not Sale']})
  sale: SaleEnum;

  @Column({type: 'varchar', length: 225, nullable: true})
  link: string;

  @JoinColumn({
    name: 'brandId',
    foreignKeyConstraintName: 'FK_product_brand_id',
    referencedColumnName: 'uuid',
  })
  @OneToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true})
  brandId: string;
}
