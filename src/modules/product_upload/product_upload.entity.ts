import {BaseEntity} from '@/core';
import {Entity, JoinColumn, ManyToOne} from 'typeorm';
import {FileEntity} from '../file';
import {ProductEntity} from '../product';

@Entity()
export class ProductUpload extends BaseEntity {
  @JoinColumn({
    name: 'productId',
    foreignKeyConstraintName: 'FK_product_upload_product_id',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => ProductEntity, (product) => product.uuid, {cascade: true})
  productId: string;

  @JoinColumn({
    name: 'productUploadId',
    foreignKeyConstraintName: 'FK_product_upload_file_id',
    referencedColumnName: 'uuid',
  })
  @ManyToOne(() => FileEntity, (file) => file.uuid, {cascade: true})
  productUploadId: string;
}
