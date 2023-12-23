import {HttpBadRequest, HttpNotFound, Meta, QueryOptions, RoleEnum} from '@/core';
import {MediaService} from '@/modules/media';
import {Injectable} from '@nestjs/common';
import {isEmail, isPhoneNumber} from 'class-validator';
import {I18nService} from 'nestjs-i18n';
import {CreateUserDTO, UpdateUserDTO} from '../dto';
import {UserEntity} from '../entities';
import {StatusUser} from '../enum';
import {IUserService} from '../interfaces';
import {UserRepository} from '../repository';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mediaService: MediaService,
    private readonly i18nService: I18nService,
  ) {}

  async createUser(args: CreateUserDTO): Promise<UserEntity> {
    try {
      const {email, password, firstName, lastName, deviceToken, deviceType} = args;
      const user = await this.userRepository.findByEmail(email);
      if (user) {
        throw new HttpBadRequest(this.i18nService.translate('content.auth.signUp.emailExists'));
      }
      const createUser = await this.userRepository.createUser(args);
      if (!createUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.auth.signUp.error'));
      }
      return createUser;
    } catch (e) {}
  }

  async readUserForAuth(information: string): Promise<UserEntity> {
    try {
      let user: UserEntity;
      if (isEmail(information)) {
        user = await this.userRepository.findForAuthEmail(information);
      } else if (isPhoneNumber(information)) {
        user = await this.userRepository.findForAuthPhone(information);
      }

      if (!user) throw new HttpNotFound(this.i18nService.translate('content.auth.signIn.notFound'));

      return user;
    } catch (e) {
      throw e;
    }
  }

  async readUser(uuid: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByUuid(uuid);
      if (!user) {
        throw new HttpNotFound(this.i18nService.translate('content.auth.signIn.notFound'));
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

      user.updatePassword(password);

      const updatedUser = await this.userRepository.save(user);

      if (!updatedUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.error'));
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

      if (!media) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.avatar'));
      }

      const updatedUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({avatar: media})
        .where('user.uuid = :uuid', {uuid: user.uuid})
        .returning('*')
        .execute()
        .then((res) => res.raw[0]);

      if (!updatedUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.avatar'));
      }

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserCover(uuid: string, cover: Express.Multer.File): Promise<UserEntity> {
    try {
      const user = await this.readUser(uuid);

      const media = await this.mediaService.uploadFile(cover);

      if (!media) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.cover'));
      }

      const updatedUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({cover: media})
        .where('user.uuid = :uuid', {uuid: user.uuid})
        .returning('*')
        .execute()
        .then((res) => res.raw[0]);

      if (!updatedUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.cover'));
      }

      return updatedUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserPhone(uuid: string, phone: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByPhone(phone);

      if (user) {
        throw new HttpBadRequest(this.i18nService.translate('content.auth.signUp.phoneExists'));
      }

      await this.readUser(uuid);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({phone: phone})
        .where('user.uuid = :uuid', {uuid: uuid})
        .execute()
        .then((res) => res.raw[0]);

      if (!updateUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.phone'));
      }

      return updateUser;
    } catch (e) {
      throw e;
    }
  }

  async updateUserEmail(uuid: string, email: string): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findByEmail(email);

      if (user) {
        throw new HttpBadRequest(this.i18nService.translate('content.auth.signUp.emailExists'));
      }

      await this.readUser(uuid);

      const updateUser = await this.userRepository
        .createQueryBuilder('user')
        .update()
        .set({email: email})
        .where('user.uuid = :uuid', {uuid: uuid})
        .execute()
        .then((res) => res.raw[0]);

      if (!updateUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.email'));
      }

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

      if (!updateUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.error'));
      }

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

      if (!updateUser) {
        throw new HttpBadRequest(this.i18nService.translate('content.profile.update.error'));
      }

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
