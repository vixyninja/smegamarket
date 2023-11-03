import {BaseEntity} from '@/core';
import * as bcryptjs from 'bcryptjs';
import {BeforeInsert, BeforeUpdate, Column, Entity} from 'typeorm';
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

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }

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
  @BeforeUpdate()
  async hashPasswordBeforeInsert() {
    this.salt = await bcryptjs.genSalt(Math.round(Math.random() * 10));
    this.hashPassword = await bcryptjs.hash(this.hashPassword, this.salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const hashPassword = await bcryptjs.hash(password, this.salt);
    return hashPassword === this.hashPassword;
  }
}
