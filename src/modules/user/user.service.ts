import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as firebaseAdmin from 'firebase-admin';
import {Model} from 'mongoose';
import {RedisxService} from 'src/configs/redisx/redisx.service';
import {HttpBadRequest} from 'src/core';
import {HttpResponse} from 'src/interface';
import {User} from 'src/models';
import {CreateUserDTO} from './dto/createUserDTO';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly redisService: RedisxService,
  ) {}

  async me(firebase_uid: string) {
    try {
      let data: any;
      data = await this.redisService.getKey(firebase_uid);
      if (data) {
        return new HttpResponse<any>(200, JSON.parse(data), 'Get infomation success');
      }

      // check firebase_uid exists, if not exists, throw error => check strategy firebase-auth
      if (!firebase_uid) {
        throw new HttpBadRequest('Token signature invalid');
      }

      // get user from mongodb by firebase_uid
      const dataMongo = await this.userModel.findOne({firebase_uid}).exec();

      if (!dataMongo) {
        throw new HttpBadRequest('User not found');
      }
      // get user from firebase by firebase_uid
      const dataFirebase = await firebaseAdmin.auth().getUser(firebase_uid);

      if (!dataFirebase) {
        throw new HttpBadRequest('User not found');
      }

      data = {
        ...dataMongo.toJSON(),
        ...dataFirebase.toJSON(),
      };

      await this.redisService.setKey(firebase_uid, JSON.stringify(data));

      return new HttpResponse<any>(200, data, 'Get infomation success');
    } catch (e) {
      throw new HttpBadRequest('Token signature invalid');
    }
  }

  async create(createUserDTO: CreateUserDTO) {
    return await this.userModel.create({
      ...createUserDTO,
    });
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({email}).exec();
  }

  async findOneById(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async updateOneById(id: string, user: Partial<User>) {
    return await this.userModel.findByIdAndUpdate(id, user, {new: true}).exec();
  }

  async deleteOneById(id: string) {
    return await this.userModel.findByIdAndDelete(id).exec();
  }

  async findAll() {
    return await this.userModel.find().exec();
  }
}
