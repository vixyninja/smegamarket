import {BaseEntity, RoleEnum} from '@/core';
import {Column, Entity, JoinTable, ManyToMany} from 'typeorm';

@Entity({
  name: 'tag',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class TagEntity extends BaseEntity {
  @Column({name: 'tag_name', nullable: false, type: 'varchar', length: 225})
  tagName: string;

  @Column({name: 'icon', nullable: false, type: 'bytea'})
  icon: Buffer;

  @Column({name: 'created_by', nullable: false, type: 'varchar', length: 225, default: RoleEnum.ADMIN})
  createdBy: string;

  @Column({name: 'updated_by', nullable: false, type: 'varchar', length: 225, default: RoleEnum.ADMIN})
  updatedBy: string;

  // RELATION JOIN TABLE
  // @ManyToMany(() => TagEntity, (tag) => tag.uuid, {lazy: true, cascade: true})
  // @JoinTable({
  //   name: 'product_tag',
  //   joinColumn: {
  //     name: 'tag_id',
  //     referencedColumnName: 'uuid',
  //   },
  //   inverseJoinColumn: {
  //     name: 'product_id',
  //     referencedColumnName: 'uuid',
  //   },
  // })
  // products: TagEntity[];

  constructor(partial: Partial<TagEntity>) {
    super();
    Object.assign(this, partial);
  }
}
