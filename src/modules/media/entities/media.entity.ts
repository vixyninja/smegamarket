import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity({
  name: 'media',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class MediaEntity extends BaseEntity {
  @Column({type: 'varchar', length: 255})
  publicId: string;

  @Column({type: 'varchar', length: 255})
  signature: string;

  @Column({type: 'numeric', default: 0})
  version: number;

  @Column({type: 'numeric', default: 0})
  width: number;

  @Column({type: 'numeric', default: 0})
  height: number;

  @Column({type: 'varchar', length: 255})
  format: string;

  @Column({type: 'varchar', length: 255})
  resourceType: string;

  @Column({type: 'varchar', length: 255})
  url: string;

  @Column({type: 'varchar', length: 255})
  secureUrl: string;

  @Column({type: 'numeric', default: 0})
  bytes: number;

  @Column({type: 'varchar', length: 255})
  assetId: string;

  @Column({type: 'varchar', length: 255})
  versionId: string;

  @Column({type: 'varchar', array: true, length: 255})
  tags: string[];

  @Column({type: 'varchar', length: 255})
  etag: string;

  @Column({type: 'boolean', default: false})
  placeholder: boolean;

  @Column({type: 'varchar', length: 255})
  originalFilename: string;

  @Column({type: 'varchar', length: 255})
  apiKey: string;

  @Column({type: 'varchar', length: 255})
  folder: string;

  constructor(partial: Partial<MediaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
