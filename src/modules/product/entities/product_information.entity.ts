import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';
import {ProductEnum, SaleEnum, SizeEnum, StatusEnum} from '../enum';

@Entity({
  name: 'product_information',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductInformationEntity extends BaseEntity {
  @Column({type: 'numeric', nullable: false, default: 0})
  price: number;

  @Column({type: 'enum', enum: ProductEnum, default: ProductEnum.Etc})
  type: ProductEnum;

  @Column({type: 'enum', enum: StatusEnum, default: StatusEnum.Active})
  status: StatusEnum;

  @Column({type: 'enum', enum: SizeEnum, default: SizeEnum.None})
  size: SizeEnum;

  @Column({type: 'enum', enum: SaleEnum, default: SaleEnum.None})
  sale: SaleEnum;

  @Column({type: 'varchar', length: 225, nullable: true})
  link: string;

  @Column({type: 'text', nullable: true})
  description: string;
}
