import {BaseEntity, RoleEnum} from '@/core';
import * as bcryptjs from 'bcryptjs';
import {BeforeInsert, Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import {FileEntity} from '../file';
import {StatusUser} from './enum';

@Entity({
  name: 'user',
  orderBy: {
    createdAt: 'DESC',
  },
})
export class UserEntity extends BaseEntity {
  @Column({type: 'varchar', length: 225, nullable: false})
  firstName: string;

  @Column({type: 'varchar', length: 225, nullable: false})
  lastName: string;

  @Column({type: 'varchar', length: 225, nullable: false, unique: true})
  email: string;

  @Column({type: 'varchar', length: 225, nullable: true, unique: true, default: null})
  phone: string;

  @Column({type: 'varchar', length: 225, nullable: false})
  hashPassword: string;

  @Column({type: 'varchar', length: 225, nullable: false})
  salt: string;

  @Column({type: 'enum', enum: RoleEnum, default: RoleEnum.USER})
  role: RoleEnum;

  @Column({type: 'enum', enum: StatusUser, default: StatusUser.INACTIVE})
  status: StatusUser;

  @Column({type: 'varchar', length: 225, default: null})
  deviceToken: string;

  @Column({type: 'varchar', length: 225, default: null})
  deviceType: string;

  @JoinColumn({
    name: 'avatar',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_USER_AVATAR',
  })
  @OneToOne(() => FileEntity, (file) => file.uuid, {cascade: true, nullable: true})
  avatar: FileEntity;

  @JoinColumn({
    name: 'cover',
    referencedColumnName: 'uuid',
    foreignKeyConstraintName: 'FK_USER_COVER',
  })
  @OneToOne(() => FileEntity, (file) => file.uuid, {cascade: true, nullable: true})
  cover: FileEntity;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.salt = await bcryptjs.genSalt(Math.round(Math.random() * 10));
    this.hashPassword = await bcryptjs.hash(this.hashPassword, this.salt);
  }

  async updatePassword(password: string) {
    this.salt = await bcryptjs.genSalt(Math.round(Math.random() * 10));
    this.hashPassword = await bcryptjs.hash(password, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcryptjs.hash(password, this.salt);
    return hashPassword === this.hashPassword;
  }

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
