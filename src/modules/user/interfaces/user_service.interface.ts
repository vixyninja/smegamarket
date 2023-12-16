import {RoleEnum} from '@/core';
import {QueryOptions} from 'mongoose';
import {CreateUserDTO, UpdateUserDTO} from '../dto';
import {StatusUser} from '../enum';

export interface IUserService {
  // user
  findForAuth(email: string): Promise<any>;
  findByEmail(email: string): Promise<any>;
  findByPhone(phone: string): Promise<any>;
  findByUuid(uuid: string): Promise<any>;
  createUser(arg: CreateUserDTO): Promise<any>;
  readUser(uuid: string): Promise<any>;
  query(query: QueryOptions): Promise<any>;
  updateUser(uuid: string, arg: UpdateUserDTO): Promise<any>;
  updateUserPassword(uuid: string, password: string): Promise<any>;
  updateUserAvatar(uuid: string, avatar: Express.Multer.File): Promise<any>;
  updateUserCover(uuid: string, cover: Express.Multer.File): Promise<any>;
  updateUserPhone(uuid: string, phone: string): Promise<any>;
  updateUserEmail(uuid: string, email: string): Promise<any>;

  //   admin
  readUsers(): Promise<any>;
  updateUserStatus(uuid: string, status: StatusUser): Promise<any>;
  updateUserRole(uuid: string, role: RoleEnum): Promise<any>;
  deleteUser(uuid: string): Promise<any>;
}
