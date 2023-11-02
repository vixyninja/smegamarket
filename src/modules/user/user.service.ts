import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDTO, UpdateUserDTO} from './dto';
import {UserEntity} from './user.entity';
import {HttpBadRequest} from '@/core';

interface UserServiceInterface {
  createUser(createUserDTO: CreateUserDTO): Promise<UserEntity>;
  readUser(uuid: string): Promise<UserEntity>;
  readUsers(): Promise<UserEntity[]>;
  updateUser(uuid: string, updateUserDTO: UpdateUserDTO): Promise<UserEntity>;
  deleteUser(uuid: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
}
@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.userRepository.findOne({where: {email: email}});
      if (user) return user;
      return null;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDTO);
    return await this.userRepository.save(user);
  }

  async readUser(uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({where: {uuid: uuid}});
  }

  async readUsers(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }
  async updateUser(uuid: string, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
    const user = await this.userRepository.findOne({where: {uuid: uuid}});
    this.userRepository.merge(user, updateUserDTO);
    return await this.userRepository.save(user);
  }
  async deleteUser(uuid: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({where: {uuid: uuid}});
    return await this.userRepository.remove(user);
  }
}
