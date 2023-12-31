import {HttpBadRequest, HttpNotFound, Meta, QueryOptions, RoleEnum} from '@/core';
import {MediaService} from '@/modules/media';
import {Injectable} from '@nestjs/common';
import {isEmail, isPhoneNumber} from 'class-validator';
import {CreateUserDTO, UpdateUserDTO} from '../dtos';
import {UserEntity} from '../entities';
import {StatusUser} from '../enums';
import {IUserService} from '../interfaces';
import {UserRepository} from '../repositories';

@Injectable()
export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository, private readonly mediaService: MediaService) {}

  async createUser(args: CreateUserDTO): Promise<UserEntity> {
    try {
      const {email, ...props} = args;
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        throw new HttpBadRequest("User's email already exists");
      }
      const createUser = await this.userRepository.createUser(args);
      if (!createUser) {
        throw new HttpBadRequest('Create user failed');
      }
      return createUser;
    } catch (e) {
      throw e;
    }
  }

  async readUserForAuth(information: string): Promise<UserEntity> {
    try {
      let user: UserEntity;
      if (isEmail(information)) {
        user = await this.userRepository.findForAuthEmail(information);
      } else if (isPhoneNumber(information)) {
        user = await this.userRepository.findForAuthPhone(information);
      }

      return user;
    } catch (e) {
      throw e;
    }
  }

  async readUserForCreate(information: string): Promise<UserEntity> {
    try {
      let user: UserEntity;
      if (isEmail(information)) {
        user = await this.userRepository.findByEmail(information);
      } else if (isPhoneNumber(information)) {
        user = await this.userRepository.findByPhone(information);
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async readUser(uuid: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByUuid(uuid);
      if (!user) {
        throw new HttpNotFound('User not found');
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  async query(query: QueryOptions): Promise<{
    data: UserEntity[];
    meta: Meta;
  }> {
    try {
      const {_page, _limit, _order, _sort} = QueryOptions.initialize(query);

      const [users, total] = await this.userRepository
        .createQueryBuilder('user')
        .loadAllRelationIds()
        .skip((_page - 1) * _limit)
        .take(_limit)
        .orderBy(`user.${_sort}`, _order)
        .getManyAndCount();

      return {
        data: users,
        meta: new Meta(_page, _limit, total, Math.ceil(total / _limit), QueryOptions.initialize(query)),
      };
    } catch (e) {
      throw e;
    }
  }

  async updateUser(uuid: string, arg: UpdateUserDTO): Promise<UserEntity> {
    try {
      const user = await this.readUser(uuid);
      const updatedUser = await this.userRepository.updateUser(user.uuid, arg);
      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserPassword(uuid: string, password: string): Promise<UserEntity> {
    try {
      const user = await this.readUser(uuid);

      user.password = password;

      const updatedUser = await this.userRepository.save(user);

      if (!updatedUser) {
        throw new HttpBadRequest("Can't update password");
      }

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserAvatar(uuid: string, avatar: Express.Multer.File): Promise<UserEntity> {
    try {
      const user = await this.readUser(uuid);

      const media = await this.mediaService.uploadFile(avatar);

      if (!media) throw new HttpBadRequest("Can't upload avatar");

      const updatedUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({avatar: media})
        .where('user.uuid = :uuid', {uuid: user.uuid})
        .returning('*')
        .execute()
        .then((res) => res.raw[0]);

      if (!updatedUser) throw new HttpBadRequest("Can't update avatar");

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserPhone(uuid: string, phone: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByPhone(phone);

      if (user.phone === phone) throw new HttpBadRequest('This phone is already exists');

      if (user) throw new HttpBadRequest("User's phone already exists");

      await this.readUser(uuid);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({phone: phone})
        .where('user.uuid = :uuid', {uuid: uuid})
        .execute()
        .then((res) => res.raw[0]);

      if (!updateUser) throw new HttpBadRequest("Can't update phone");

      return updateUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserEmail(uuid: string, email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (user.email === email) throw new HttpBadRequest('This email is already exists');

      if (user) throw new HttpBadRequest("User's email already exists");

      await this.readUser(uuid);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({email: email})
        .where('user.uuid = :uuid', {uuid: uuid})
        .execute()
        .then((res) => res.raw[0]);

      if (!updateUser) throw new HttpBadRequest("Can't update email");
      return updateUser;
    } catch (e) {
      throw e;
    }
  }

  async readUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async updateUserStatus(uuid: string, status: StatusUser): Promise<UserEntity> {
    try {
      await this.readUser(uuid);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({status: status})
        .where('user.uuid = :uuid', {uuid: uuid})
        .execute()
        .then((res) => res.raw[0]);

      if (!updateUser) throw new HttpBadRequest("Can't update status");

      return updateUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserRole(uuid: string, role: RoleEnum): Promise<UserEntity> {
    try {
      await this.readUser(uuid);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({role: role})
        .where('user.uuid = :uuid', {uuid: uuid})
        .execute()
        .then((res) => res.raw[0]);

      if (!updateUser) throw new HttpBadRequest("Can't update role");

      return updateUser;
    } catch (e) {
      throw e;
    }
  }

  async deleteUserSoft(uuid: string): Promise<UserEntity> {
    try {
      return await this.userRepository.deleteUserSoft(uuid);
    } catch (e) {
      throw e;
    }
  }
}
