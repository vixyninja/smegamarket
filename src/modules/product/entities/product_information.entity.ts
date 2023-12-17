import {BaseEntity} from '@/core';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import {ProductTypeEnum, ProductSaleEnum, ProductSizeEnum, ProductStatusEnum} from '../enum';
import {ProductEntity} from './product.entity';

@Entity({
  name: 'product_information',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductInformationEntity extends BaseEntity {
  @Column({type: 'numeric', nullable: false, default: 0})
  price: number;

  @Column({type: 'enum', enum: ProductTypeEnum, default: ProductTypeEnum.Etc})
  type: ProductTypeEnum;

  @Column({type: 'enum', enum: ProductStatusEnum, default: ProductStatusEnum.Active})
  status: ProductStatusEnum;

  @Column({type: 'enum', enum: ProductSizeEnum, default: ProductSizeEnum.None})
  size: ProductSizeEnum;

  @Column({type: 'enum', enum: ProductSaleEnum, default: ProductSaleEnum.None})
  sale: ProductSaleEnum;

  @Column({type: 'varchar', length: 225, nullable: true})
  link: string;

  @Column({type: 'text', nullable: true})
  description: string;

  @OneToMany(() => MediaEntity, (media) => media.uuid, {cascade: true, nullable: true})
  @JoinColumn({
    name: 'media_uuid',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_INFORMATION_MEDIA',
  })
  media: MediaEntity[];

  @ManyToOne(() => ProductEntity, (product) => product.uuid, {cascade: true, nullable: false})
  @JoinColumn({
    name: 'product_uuid',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_INFORMATION_PRODUCT',
  })
  product: ProductEntity;

  constructor(partial: Partial<ProductInformationEntity>) {
    super();
    Object.assign(this, partial);
  }
}
