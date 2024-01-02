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
  @Column({type: 'varchar', length: 225, nullable: true, default: null, name: 'first_name'})
  firstName: string;

  @Column({type: 'varchar', length: 225, nullable: true, default: null, name: 'last_name'})
  lastName: string;

  @Column({type: 'varchar', length: 225, nullable: false, unique: true, name: 'email'})
  email: string;

  @Column({type: 'varchar', length: 20, nullable: true, unique: true, name: 'phone'})
  phone: string;

  @Column({type: 'varchar', length: 225, nullable: false, select: false, name: 'password'})
  password: string;

  @Column({type: 'varchar', length: 225, nullable: false, select: false, name: 'salt'})
  salt: string;

  @Column({type: 'enum', enum: RoleEnum, default: RoleEnum.USER, name: 'role'})
  role: RoleEnum;

  @Column({type: 'enum', enum: StatusUser, default: StatusUser.INACTIVE, name: 'status'})
  status: StatusUser;

  @Column({type: 'varchar', length: 225, default: null, name: 'device_token'})
  deviceToken: string;

  @Column({type: 'varchar', length: 225, default: null, name: 'two_factor_temp_secret'})
  twoFactorTempSecret: string;

  @Column({type: 'boolean', default: false, name: 'two_factor_enable'})
  twoFactorEnable: boolean;

  // * RELATIONS
  @JoinColumn({foreignKeyConstraintName: 'FK_USER_AVATAR', name: 'avatar_uuid', referencedColumnName: 'uuid'})
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
