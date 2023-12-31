import {Meta, QueryOptions, RoleEnum} from '@/core';
import {CreateUserDTO, UpdateUserDTO} from '../dtos';
import {UserEntity} from '../entities';
import {StatusUser} from '../enums';

export interface IUserService {
  query(query: QueryOptions): Promise<{data: UserEntity[]; meta: Meta}>;
  createUser(arg: CreateUserDTO): Promise<UserEntity>;
  readUser(uuid: string): Promise<UserEntity>;
  readUserForAuth(information: string): Promise<UserEntity>;
  readUserForCreate(information: string): Promise<UserEntity>;
  readUsers(): Promise<UserEntity[]>;
  updateUser(uuid: string, arg: UpdateUserDTO): Promise<UserEntity>;
  updateUserPassword(uuid: string, password: string): Promise<UserEntity>;
  updateUserAvatar(uuid: string, avatar: Express.Multer.File): Promise<UserEntity>;
  updateUserPhone(uuid: string, phone: string): Promise<UserEntity>;
  updateUserEmail(uuid: string, email: string): Promise<UserEntity>;
  updateUserStatus(uuid: string, status: StatusUser): Promise<UserEntity>;
  updateUserRole(uuid: string, role: RoleEnum): Promise<UserEntity>;
  deleteUserSoft(uuid: string): Promise<UserEntity>;
}
