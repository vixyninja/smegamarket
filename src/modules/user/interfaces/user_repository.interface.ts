import {CreateUserDTO, UpdateUserDTO} from '../dto';
import {UserEntity} from '../entities';

/**
 * @description
 * This is an interface for the UserRepository class. If methods has error, catch in service.
 */
export interface IUserRepository {
  findForAuthEmail(email: string): Promise<UserEntity>;
  findForAuthPhone(phone: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
  findByPhone(phone: string): Promise<UserEntity>;
  findByUuid(uuid: string): Promise<UserEntity>;

  createUser(user: CreateUserDTO): Promise<UserEntity>;

  updateUser(uuid: string, user: UpdateUserDTO): Promise<UserEntity>;

  deleteUserSoft(uuid: string): Promise<UserEntity>;
}
