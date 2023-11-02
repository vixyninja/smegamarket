import {BaseEntity} from '@/core';
import {Expose} from 'class-transformer';
import {Column, Entity} from 'typeorm';

@Entity()
export class UserEntity extends BaseEntity {
  @Expose()
  @Column({type: 'varchar', length: 50, nullable: false})
  firstName: string;

  @Expose()
  @Column({type: 'varchar', length: 50, nullable: false})
  lastName: string;

  @Expose()
  @Column({type: 'varchar', length: 100, nullable: false, unique: true})
  email: string;

  //   @Exclude()
  //   @Column({type: 'varchar', length: 100, nullable: false, unique: true})
  //   hashPassword: string;

  //   @Exclude()
  //   @Column({type: 'varchar', length: 100, nullable: false})
  //   salt: string;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
