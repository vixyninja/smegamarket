import {UserEntity} from '../common';

export interface UserRepository {
  getInfo(uuid: number): Promise<UserEntity>;
}
