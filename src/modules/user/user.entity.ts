import {BaseEntity, RoleEnum} from '@/core';
import * as bcryptjs from 'bcryptjs';
import {BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import {FileEntity} from '../file';

export enum StatusUser {
  'ACTIVE' = 'ACTIVE',
  'INACTIVE' = 'INACTIVE',
  'BLOCKED' = 'BLOCKED',
}

@Entity()
export class UserEntity extends BaseEntity {
  @Column({type: 'varchar', length: 50, nullable: false})
  firstName: string;

  @Column({type: 'varchar', length: 50, nullable: false})
  lastName: string;

  @Column({type: 'varchar', length: 100, nullable: false, unique: true})
  email: string;

  @Column({type: 'varchar', length: 100, nullable: false})
  private hashPassword: string;

  @Column({type: 'varchar', length: 100, nullable: false})
  private salt: string;

  @Column({type: 'enum', enum: RoleEnum, default: RoleEnum.USER})
  role: RoleEnum;

  @Column({type: 'enum', enum: StatusUser, default: StatusUser.INACTIVE})
  status: StatusUser;

  @Column({type: 'varchar', length: 100, default: null})
  deviceToken: string;

  @Column({type: 'varchar', length: 100, default: null})
  deviceType: string;

  @JoinColumn({name: 'avatarId', referencedColumnName: 'uuid', foreignKeyConstraintName: 'FK_USER_AVATAR'})
  @OneToOne(() => FileEntity, (file) => file.uuid, {nullable: true})
  avatarId: string;

  getHashPassword(): string {
    return this.hashPassword;
  }

  getSalt(): string {
    return this.salt;
  }

  setHashPassword(hashPassword: string): void {
    this.hashPassword = hashPassword;
  }

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.salt = await bcryptjs.genSalt(Math.round(Math.random() * 10));
    this.hashPassword = await bcryptjs.hash(this.hashPassword, this.salt);
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
