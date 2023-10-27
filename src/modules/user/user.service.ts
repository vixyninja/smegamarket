import {Injectable} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {UserEntity} from '../common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';

@Injectable()
export class UserService implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  getInfo(uuid: number): Promise<UserEntity> {
    throw new Error('Method not implemented.');
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(entity);
  }
}
