import {BaseEntity} from '@/core';
import {Column, Entity} from 'typeorm';

@Entity({
  name: 'media',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class MediaEntity extends BaseEntity {
  @Column({name: 'public_id', type: 'varchar', length: 255, nullable: false, unique: true})
  publicId: string;

  @Column({type: 'varchar', length: 255, nullable: false, unique: true, name: 'signature'})
  signature: string;

  @Column({type: 'numeric', default: 0, nullable: false, name: 'version'})
  version: number;

  @Column({type: 'numeric', default: 0, nullable: false, name: 'width'})
  width: number;

  @Column({type: 'numeric', default: 0, nullable: false, name: 'height'})
  height: number;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'format'})
  format: string;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'resource_type'})
  resourceType: string;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'url'})
  url: string;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'secure_url'})
  secureUrl: string;

  @Column({type: 'numeric', default: 0, nullable: false, name: 'bytes'})
  bytes: number;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'asset_id'})
  assetId: string;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'version_id'})
  versionId: string;

  @Column({type: 'varchar', array: true, length: 255, nullable: false, name: 'tags'})
  tags: string[];

  @Column({type: 'varchar', length: 255, nullable: false, name: 'e_tag'})
  etag: string;

  @Column({type: 'boolean', default: false, nullable: false, name: 'placeholder'})
  placeholder: boolean;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'original_filename'})
  originalFilename: string;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'api_key'})
  apiKey: string;

  @Column({type: 'varchar', length: 255, nullable: false, name: 'folder'})
  folder: string;

  constructor(partial: Partial<MediaEntity>) {
    super();
    Object.assign(this, partial);
  }
}
