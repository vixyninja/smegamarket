import {BaseEntity} from '@/core';
import {MediaEntity} from '@/modules/media';
import {Column, Entity, JoinColumn, ManyToOne, OneToOne} from 'typeorm';
import {ProductEntity} from './product.entity';

@Entity({
  name: 'product_gallery',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class GalleryEntity extends BaseEntity {
  @Column({type: 'varchar', length: 255, nullable: false})
  imageUri: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  publicId: string;

  @JoinColumn({foreignKeyConstraintName: 'FK_PRODUCT_GALLERY_MEDIA'})
  @OneToOne(() => MediaEntity, (media) => media.uuid, {cascade: true, lazy: true})
  media: MediaEntity;

  @JoinColumn({foreignKeyConstraintName: 'FK_PRODUCT_GALLERY_PRODUCT'})
  @ManyToOne(() => MediaEntity, (media) => media.uuid, {cascade: true, lazy: true})
  product: ProductEntity;

  constructor(partial: Partial<GalleryEntity>) {
    super();
    Object.assign(this, partial);
  }
}
