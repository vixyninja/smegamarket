import {MailService, RedisxService} from '@/configs';
import {HttpBadRequest, HttpInternalServerError} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileService} from '../file';
import {CreateUserDTO, UpdateUserDTO} from './dto';
import {StatusUser} from './enum';
import {UserEntity} from './user.entity';

interface UserServiceInterface {
  createUser(arg: CreateUserDTO): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity>;
  findByPhone(phone: string): Promise<UserEntity>;
  readUser(uuid: string): Promise<UserEntity>;
  readUsers(): Promise<UserEntity[]>;
  updateUser(uuid: string, arg: UpdateUserDTO): Promise<UserEntity>;
  updateUserPassword(uuid: string, password: string): Promise<UserEntity>;
  updateUserAvatar(uuid: string, avatar: Express.Multer.File): Promise<UserEntity>;
  updateUserCover(uuid: string, cover: Express.Multer.File): Promise<UserEntity>;
  updateStatusUser(uuid: string, status: StatusUser): Promise<UserEntity>;
  updateUserPhone(uuid: string, phone: string): Promise<UserEntity>;
  updateUserEmail(uuid: string, email: string): Promise<UserEntity>;
  deleteUser(uuid: string): Promise<UserEntity>;
}
@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisxService: RedisxService,
    private readonly fileService: FileService,
    private readonly mailService: MailService,
  ) {}

  async createUser(arg: CreateUserDTO): Promise<UserEntity> {
    try {
      const {email, firstName, lastName, password} = arg;

      const user = new UserEntity({
        email: email,
        firstName: firstName,
        lastName: lastName,
      });

      user.setHashPassword(password);

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findByEmail(email: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({where: {email: email}});
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findByPhone(phone: string): Promise<UserEntity> {
    try {
      return await this.userRepository.findOne({where: {phone: phone}});
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readUser(uuid: string): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) return JSON.parse(isExist);

      const user: UserEntity = await this.userRepository.findOne({
        where: {uuid: uuid},
      });

      await this.redisxService.setKey(uuid, JSON.stringify(user));

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUser(uuid: string, updateUserDTO: UpdateUserDTO): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      const user = await this.userRepository.findOne({where: {uuid: uuid}});

      const {deviceToken, deviceType, firstName, lastName} = updateUserDTO;

      this.userRepository.merge(user, {
        deviceToken,
        deviceType,
        firstName,
        lastName,
      });

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
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
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserAvatar(uuid: string, avatar: Express.Multer.File): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      const user = await this.userRepository.findOne({where: {uuid: uuid}});

      const avatarUpload = await this.fileService.uploadFile(avatar);

      if (!avatarUpload) throw new HttpBadRequest('Upload avatar failed');

      user.avatar = avatarUpload;

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserCover(uuid: string, cover: Express.Multer.File): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      const user = await this.userRepository.findOne({where: {uuid: uuid}});

      const coverUpload = await this.fileService.uploadFile(cover);

      if (!coverUpload) throw new HttpBadRequest('Upload cover failed');

      user.cover = coverUpload;

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateStatusUser(uuid: string, status: StatusUser): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      return await this.userRepository.save({uuid: uuid, status: status});
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserPhone(uuid: string, phone: string): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      const user = await this.userRepository.findOne({where: {uuid: uuid}});

      user.phone = phone;

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
  async updateUserEmail(uuid: string, email: string): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      const userExist = await this.userRepository.findOne({where: {email: email}});

      if (userExist) throw new HttpBadRequest('Email already exists');

      const user = await this.userRepository.findOne({where: {uuid: uuid}});

      user.email = email;

      return await this.userRepository.save(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteUser(uuid: string): Promise<UserEntity> {
    try {
      const isExist = await this.redisxService.getKey(uuid);

      if (isExist) await this.redisxService.delKey(uuid);

      const user = await this.userRepository.findOne({where: {uuid: uuid}});

      return await this.userRepository.remove(user);
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
