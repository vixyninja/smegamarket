import {HttpNotFound} from '@/core';
import {I18nTranslations} from '@/i18n';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {I18nContext, I18nService} from 'nestjs-i18n';
import {Repository} from 'typeorm';
import {CreateUserDTO, UpdateUserDTO} from '../dto';
import {UserEntity} from '../entities';
import {IUserRepository} from '../interfaces';

@Injectable()
export class UserRepository extends Repository<UserEntity> implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly i18nService: I18nService<I18nTranslations>,
  ) {
    super(userRepository.target, userRepository.manager, userRepository.queryRunner);
  }

  /**
   *
   * @param email
   * @returns returns user with hashPassword and salt
   */
  async findForAuthEmail(email: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', {email})
      .addSelect('user.hashPassword')
      .addSelect('user.salt')
      .getOne();
  }

  /**
   *
   * @param phone
   * @returns returns user with hashPassword and salt
   */
  async findForAuthPhone(phone: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.phone = :phone', {phone})
      .addSelect('user.hashPassword')
      .addSelect('user.salt')
      .getOne();
  }

  /**
   *
   * @param email
   * @returns returns user without hashPassword and salt
   */
  async findByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.createQueryBuilder('user').where('user.email = :email', {email}).getOne();
  }

  /**
   *
   * @param phone
   * @returns returns user without hashPassword and salt
   */
  async findByPhone(phone: string): Promise<UserEntity> {
    return await this.userRepository.createQueryBuilder('user').where('user.phone = :phone', {phone}).getOne();
  }

  /**
   *
   * @param uuid
   * @returns returns user without hashPassword and salt
   */
  async findByUuid(uuid: string): Promise<UserEntity> {
    return await this.userRepository.createQueryBuilder('user').where('user.uuid = :uuid', {uuid}).getOne();
  }

  /**
   *
   * @param args
   * @returns returns user without hashPassword and salt
   */
  async createUser(args: CreateUserDTO): Promise<UserEntity> {
    const {email, password, firstName, lastName, deviceToken, deviceType, ...props} = args;

    return await this.userRepository
      .createQueryBuilder('user')
      .insert()
      .values({
        email,
        firstName,
        lastName,
        deviceToken,
        deviceType,
        hashPassword: password,
        ...props,
      })
      .execute()
      .then((res) => res.raw[0]);
  }

  async updateUser(uuid: string, args: UpdateUserDTO): Promise<UserEntity> {
    const {email, deviceToken, deviceType, firstName, lastName, password, ...props} = args;

    const user = await this.findByUuid(uuid).then((res) => {
      if (!res) throw new HttpNotFound(this.i18nService.translate('content.auth.signIn.notFound'));
      return res;
    });

    return await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({
        email: email || user.email,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        deviceToken: deviceToken || user.deviceToken,
        deviceType: deviceType || user.deviceType,
        hashPassword: password || user.hashPassword,
        ...(props || user),
      })
      .where('user.uuid = :uuid', {uuid: uuid})
      .execute()
      .then((res) => res.raw[0]);
  }

  async deleteUserSoft(uuid: string): Promise<UserEntity> {
    await this.findByUuid(uuid).then((res) => {
      if (!res) throw new HttpNotFound(this.i18nService.translate('content.auth.signIn.notFound'));
      return res;
    });

    return await this.userRepository
      .createQueryBuilder('user')
      .update()
      .set({
        deletedAt: new Date(),
      })
      .where('user.uuid = :uuid', {uuid: uuid})
      .execute()
      .then((res) => res.raw[0]);
  }
}
