import {Inject, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseAuth from 'firebase/auth';
import {Model} from 'mongoose';
import {RedisxService} from 'src/configs/redisx/redisx.service';
import {HttpBadRequest, HttpInternalServerError} from 'src/core';
import {HttpOk, HttpResponse} from 'src/interface';
import {User} from 'src/models';
import {CreateUserDTO} from './dto/createUserDTO';
import {UpdatePasswordDTO} from './dto/updatePasswordDTO';
import {CloudinaryService} from 'src/configs';
import {UpdateProfileDTO} from './dto/updateUserDTO';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject('FirebaseAuth') private readonly firebaseAuth: firebaseAuth.Auth,
    private readonly redisService: RedisxService,
    private readonly cloudinaryService: CloudinaryService,
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

  async updatePassword(email: string, updatePasswordDTO: UpdatePasswordDTO) {
    try {
      // check email & password exists
      let user = await firebaseAuth.signInWithEmailAndPassword(this.firebaseAuth, email, updatePasswordDTO.oldPassword);
      // when user not found, throw error
      if (!user) {
        throw new HttpBadRequest('Old password is incorrect');
      }

      // update password
      let updateUser = await firebaseAuth.updatePassword(user.user, updatePasswordDTO.newPassword);
      if (updateUser === null) {
        throw new HttpBadRequest('Update password failed');
      }
      return new HttpOk('Update password successfully');
    } catch (e) {
      console.log(e);
      throw new HttpInternalServerError('Update password failed');
    }
  }

  async updateProfile(firebase_uid: string, updateProfileDTO: UpdateProfileDTO) {
    try {
      let {name} = updateProfileDTO;
      let user: any;
      let userModel: any;
      // check user in firebase exists
      user = await firebaseAdmin.auth().getUser(firebase_uid);
      if (!user) {
        throw new HttpBadRequest('User not found');
      }
      // check user in mongodb exists
      userModel = await this.userModel.findOne({firebase_uid}).exec();
      if (!userModel) {
        throw new HttpBadRequest('User not found');
      }
      // update name in firebase
      user = await firebaseAdmin.auth().updateUser(firebase_uid, {
        displayName: name,
      });
      if (!user) {
        throw new HttpBadRequest('Update profile failed');
      }
      // update name in mongodb
      userModel = await this.userModel.findByIdAndUpdate(userModel._id, {
        name,
      });
      if (!userModel) {
        throw new HttpBadRequest('Update profile failed');
      }
      // update redis
      let data: any;
      data = await this.redisService.getKey(firebase_uid);
      if (data) {
        data = JSON.parse(data);
        data.name = name;
        await this.redisService.setKey(firebase_uid, JSON.stringify(data));
      }
      return new HttpOk('Update profile successfully');
    } catch (e) {
      console.log(e);
      throw new HttpInternalServerError('Update profile failed');
    }
  }

  async updateProfilePicture(firebase_uid: string, file: Express.Multer.File) {
    try {
      let user: any;
      let userModel: any;

      // check user in firebase exists
      user = await firebaseAdmin.auth().getUser(firebase_uid);
      if (!user) {
        throw new HttpBadRequest('User not found');
      }
      // check user in mongodb exists
      userModel = await this.userModel.findOne({firebase_uid}).exec();
      if (!userModel) {
        throw new HttpBadRequest('User not found');
      }
      // upload file to cloudinary
      const cloudinaryResponse = await this.cloudinaryService.uploadFileImage(file);

      if (!cloudinaryResponse) {
        throw new HttpInternalServerError('Upload avatar failed');
      }

      // update profile picture in mongodb
      userModel = await this.userModel.findByIdAndUpdate(
        userModel._id,
        {
          avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
          },
        },
        {
          new: true,
        },
      );

      if (!userModel) {
        throw new HttpBadRequest('Update profile picture failed');
      }
      // update redis
      let data: any;
      data = await this.redisService.getKey(firebase_uid);
      if (data) {
        data = JSON.parse(data);
        data.avatar = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
        await this.redisService.setKey(firebase_uid, JSON.stringify(data));
      }
      return new HttpOk('Update profile picture successfully');
    } catch (e) {
      throw new HttpInternalServerError('Upload avatar failed');
    }
  }

  async getRole(firebase_uid: string) {
    try {
      let user: any;
      let userModel: any;
      // check user in firebase exists
      user = await firebaseAdmin.auth().getUser(firebase_uid);
      if (!user) {
        throw new HttpBadRequest('User not found');
      }
      // check user in mongodb exists
      userModel = await this.userModel.findOne({firebase_uid}).exec();
      if (!userModel) {
        throw new HttpBadRequest('User not found');
      }
      return userModel.role;
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }
}
