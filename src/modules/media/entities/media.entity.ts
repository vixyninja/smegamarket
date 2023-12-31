import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity({
  name: 'media',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class MediaEntity extends BaseEntity {
  @Column({type: 'varchar', length: 255, nullable: false, unique: true})
  publicId: string;

  @Column({type: 'varchar', length: 255, nullable: false, unique: true})
  signature: string;

  @Column({type: 'numeric', default: 0, nullable: false})
  version: number;

  @Column({type: 'numeric', default: 0, nullable: false})
  width: number;

  @Column({type: 'numeric', default: 0, nullable: false})
  height: number;

  @Column({type: 'varchar', length: 255, nullable: false})
  format: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  resourceType: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  url: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  secureUrl: string;

  @Column({type: 'numeric', default: 0, nullable: false})
  bytes: number;

  @Column({type: 'varchar', length: 255, nullable: false})
  assetId: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  versionId: string;

  @Column({type: 'varchar', array: true, length: 255})
  tags: string[];

  @Column({type: 'varchar', length: 255, nullable: false})
  etag: string;

  @Column({type: 'boolean', default: false, nullable: false})
  placeholder: boolean;

  @Column({type: 'varchar', length: 255, nullable: false})
  originalFilename: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  apiKey: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  folder: string;

  constructor(partial: Partial<MediaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
