import {BaseEntity} from '@/core';
import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import {BrandEntity} from '../brand';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from './enum';

@Entity()
export class ProductEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: false})
  name: string;

  @Column({type: 'numeric', nullable: false})
  price: number;

  @Column({type: 'enum', enum: ProductEnum, default: ProductEnum.Etc})
  type: ProductEnum;

  @Column({type: 'enum', enum: StatusEnum, default: StatusEnum.Active})
  status: StatusEnum;

  @Column({type: 'enum', enum: SizeEnum, default: SizeEnum.Medium})
  size: SizeEnum;

  @Column({type: 'varchar', array: true, nullable: true})
  detail: string[];

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
  @OneToOne(() => BrandEntity, (brand) => brand.uuid, {cascade: true})
  brandId: string;
}
