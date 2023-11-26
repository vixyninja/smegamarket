import {BaseEntity} from '@/core';
import {MediaEntity, MediaEnum} from '@/modules/media';
import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {ProductEntity} from './product.entity';

@Entity({
  name: 'product_media',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class ProductMediaEntity extends BaseEntity {
  @Column({type: 'varchar', enum: MediaEnum, default: MediaEnum.Etc})
  type: MediaEnum;

  @JoinColumn({
    name: 'productId',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_MEDIA_PRODUCT',
  })
  @ManyToOne(() => ProductEntity, (product) => product.uuid, {cascade: true})
  product: ProductEntity;

  @JoinColumn({
    name: 'mediaId',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_PRODUCT_MEDIA_MEDIA',
  })
  @ManyToOne(() => MediaEntity, (media) => media.uuid, {cascade: true})
  media: MediaEntity;
}
