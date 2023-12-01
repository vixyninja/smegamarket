import {RedisxService} from '@/configs';
import {CACHE_KEY, HttpBadRequest, HttpInternalServerError, HttpNotFound, RoleEnum} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {MediaService} from '../media';
import {CreateUserDTO, UpdateUserDTO} from './dto';
import {UserEntity} from './entities';
import {StatusUser} from './enum';
import {Meta, QueryOptions} from '@/core/interface';

interface UserServiceInterface {
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
@Injectable()
export class UserService implements UserServiceInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisxService: RedisxService,
    private readonly mediaService: MediaService,
  ) {}

  async findForAuth(email: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .loadAllRelationIds()
        .addSelect('user.hashPassword')
        .addSelect('user.salt')
        .where('user.email = :email', {email: email})
        .getOne();

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findByEmail(email: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .loadAllRelationIds()
        .where('user.email = :email', {email: email})
        .getOne();

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findByPhone(phone: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .loadAllRelationIds()
        .where('user.phone = :phone', {phone: phone})
        .getOne();

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async findByUuid(uuid: string): Promise<any> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .loadAllRelationIds()
        .where('user.uuid = :uuid', {uuid: uuid})
        .getOne();

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async createUser(arg: CreateUserDTO): Promise<any> {
    try {
      const {email, firstName, lastName, password} = arg;

      const user = new UserEntity({
        email: email,
        firstName: firstName,
        lastName: lastName,
        role: email === 'nevergiveup2k3@gmail.com' ? RoleEnum.ADMIN : RoleEnum.USER,
        status: email === 'nevergiveup2k3@gmail.com' ? StatusUser.ACTIVE : StatusUser.INACTIVE,
        hashPassword: password,
      });

      const saveUser = await this.userRepository.createQueryBuilder('user').insert().values(user).execute();

      if (!saveUser) return new HttpBadRequest('Create user failed');

      const userCreated = await this.userRepository.findOne({where: {uuid: saveUser.raw.insertId}});

      return userCreated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readUser(uuid: string): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) return JSON.parse(isExist);

      const user = await this.findByUuid(uuid);

      if (!user) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(user));

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async query(query: QueryOptions): Promise<any> {
    try {
      const {_limit, _order, _page, _sort} = QueryOptions.initialize(query);

      const [users, total] = await this.userRepository
        .createQueryBuilder('user')
        .loadAllRelationIds()
        .skip((_page - 1) * _limit)
        .take(_limit)
        .orderBy(`user.${_sort}`, _order === 'ASC' ? 'ASC' : 'DESC')
        .getManyAndCount();

      return {
        data: users,
        meta: new Meta(_page, _limit, total, Math.ceil(total / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readUsers(): Promise<any> {
    try {
      const users = await this.userRepository.createQueryBuilder('user').loadAllRelationIds().getMany();
      return users;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUser(uuid: string, updateUserDTO: UpdateUserDTO): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const user = await this.findByUuid(uuid);

      if (!user) {
        throw new HttpNotFound('User not found');
      }

      const {deviceToken, deviceType, firstName, lastName} = updateUserDTO;

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({
          deviceToken: deviceToken ?? user.deviceToken,
          deviceType: deviceType ?? user.deviceType,
          firstName: firstName ?? user.firstName,
          lastName: lastName ?? user.lastName,
        })
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const userUpdated = await this.findByUuid(uuid);

      if (!userUpdated) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(userUpdated));

      return userUpdated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserPassword(uuid: string, password: string): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      await user.updatePassword(password);

      const saveUser = await this.userRepository.save(user);

      if (!saveUser) return new HttpBadRequest('Update user failed');

      const updateUser = await this.findByUuid(uuid);

      if (!updateUser) return new HttpBadRequest('Update user failed');

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(updateUser));

      return updateUser;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserAvatar(uuid: string, file: Express.Multer.File): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      const avatarUpload = await this.mediaService.uploadFile(file, 'avatar');

      if (!avatarUpload) return new HttpBadRequest('Upload avatar failed');

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({avatar: avatarUpload ?? user.avatar})
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const userUpdated = await this.findByUuid(uuid);

      if (!userUpdated) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(userUpdated));

      return userUpdated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserCover(uuid: string, file: Express.Multer.File): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      const coverUpload = await this.mediaService.uploadFile(file, 'cover');

      if (!coverUpload) return new HttpBadRequest('Upload cover failed');

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({cover: coverUpload})
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const userUpdated = await this.findByUuid(uuid);

      if (!userUpdated) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(userUpdated));

      return userUpdated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserStatus(uuid: string, status: StatusUser): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({status: status})
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const userUpdated = await this.findByUuid(uuid);

      if (!userUpdated) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(userUpdated));

      return userUpdated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserPhone(uuid: string, phone: string): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const userExist = await this.userRepository
        .createQueryBuilder('user')
        .where('phone = :phone', {phone: phone})
        .getOne();

      if (userExist) return new HttpBadRequest('Phone already exists');

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({phone: phone})
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const userUpdated = await this.findByUuid(uuid);

      if (!userUpdated) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(userUpdated));

      return userUpdated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserEmail(uuid: string, email: string): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const userExist = await this.userRepository
        .createQueryBuilder('user')
        .where('email = :email', {email: email})
        .getOne();

      if (userExist) return new HttpBadRequest('Email already exists');

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({email: email})
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const userUpdated = await this.findByUuid(uuid);

      if (!userUpdated) {
        return new HttpNotFound('User not found');
      }

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(userUpdated));

      return userUpdated;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async updateUserRole(uuid: string, role: RoleEnum): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update(UserEntity)
        .set({role: role})
        .where('uuid = :uuid', {uuid: uuid})
        .execute();

      if (!updateUser) return new HttpBadRequest('Update user failed');

      const user = await this.findByUuid(uuid);

      if (!user) return new HttpNotFound('User not found');

      await this.redisxService.setKey(`${CACHE_KEY.user}:${uuid}`, JSON.stringify(user));

      return user;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteUser(uuid: string): Promise<any> {
    try {
      const isExist = await this.redisxService.getKey(`${CACHE_KEY.user}:${uuid}`);

      if (isExist) await this.redisxService.delKey(`${CACHE_KEY.user}:${uuid}`);

      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('uuid = :uuid', {uuid: uuid})
        .softDelete()
        .execute();

      if (!user) return new HttpNotFound('User not found');

      const deleteUser = await this.findByUuid(uuid);

      if (!deleteUser) return new HttpBadRequest('Delete user failed');

      return 'Delete user success';
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
