import {RedisxService} from '@/configs';
import {HttpBadRequest} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDTO, UpdateUserDTO} from './dto';
import {UserEntity} from './user.entity';

interface UserServiceInterface {
  createUser(createUserDTO: CreateUserDTO): Promise<UserEntity>;
  readUser(uuid: string): Promise<UserEntity>;
  readUsers(): Promise<UserEntity[]>;
  updateUser(uuid: string, updateUserDTO: UpdateUserDTO): Promise<UserEntity>;
  updateUserPassword(uuid: string, password: string): Promise<UserEntity>;
  deleteUser(uuid: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
}
@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisxService: RedisxService,
  ) {}

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({where: {email: email}});
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async createUser(createUserDTO: CreateUserDTO): Promise<UserEntity> {
    try {
      const user = this.userRepository.create({
        ...createUserDTO,
        hashPassword: createUserDTO.password,
      });
      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async readUser(uuid: string): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);
      if (isExist) return JSON.parse(isExist);
      const user: UserEntity = await this.userRepository.findOne({where: {uuid: uuid}});
      await this.redisxService.setKey(uuid, JSON.stringify(user));
      return user;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async readUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async updateUser(uuid: string, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);
      if (isExist) await this.redisxService.delKey(uuid);
      const user = await this.userRepository.findOne({where: {uuid: uuid}});
      this.userRepository.merge(user, updateUserDTO);
      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async updateUserPassword(uuid: string, password: string): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);
      if (isExist) await this.redisxService.delKey(uuid);
      const user = await this.userRepository.findOne({where: {uuid: uuid}});
      user.setHashPassword(password);
      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async deleteUser(uuid: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({where: {uuid: uuid}});
      return await this.userRepository.remove(user);
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
