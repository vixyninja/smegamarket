import {Module} from '@nestjs/common';
import {UserService} from './user.service';
import {UserController} from './user.controller';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from 'src/models';
import {FireBaseModule} from 'src/auth/firebase/firebase.module';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), FireBaseModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
