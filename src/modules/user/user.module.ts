import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from 'src/models';
import {FireBaseModule} from 'src/auth/firebase/firebase.module';
import {RedisxModule} from 'src/configs/redisx/redisx.module';
import {CloudinaryModule} from 'src/configs';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    FireBaseModule,
    RedisxModule,
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
