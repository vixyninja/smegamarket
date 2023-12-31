import {BaseEntity, RoleEnum} from '@/core';
import {MediaEntity} from '@/modules/media';
import * as bcryptjs from 'bcryptjs';
import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import {StatusUser} from '../enums';

@Entity({
  name: 'user',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  firstName: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null})
  lastName: string;

  @Column({type: 'varchar', length: 225, nullable: false, unique: true})
  email: string;

  @Column({type: 'varchar', length: 20, nullable: true, unique: true})
  phone: string;

  @Column({type: 'varchar', length: 225, nullable: false, select: false})
  password: string;

  @Column({type: 'varchar', length: 225, nullable: false, select: false})
  salt: string;

  @Column({type: 'enum', enum: RoleEnum, default: RoleEnum.USER})
  role: RoleEnum;

  @Column({type: 'enum', enum: StatusUser, default: StatusUser.INACTIVE})
  status: StatusUser;

  @Column({type: 'varchar', length: 225, default: null})
  deviceToken: string;

  @JoinColumn({foreignKeyConstraintName: 'FK_USER_AVATAR'})
  @OneToOne(() => MediaEntity, (media) => media.uuid, {cascade: true, nullable: true})
  avatar: MediaEntity;

  async comparePassword(attempt: string): Promise<boolean> {
    const password = await bcryptjs.hash(attempt, this.salt);
    return password === this.password;
  }

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
