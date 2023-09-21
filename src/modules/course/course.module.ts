import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CloudinaryModule} from 'src/configs';
import {Course, CourseData, CourseDataSchema, CourseSchema} from 'src/models';
import {CommentModule} from '../comment';
import {ReviewModule} from '../review';
import {UserModule} from '../user';
import {CourseController} from './course.controller';
import {CourseService} from './course.service';
import {LinkModule} from '../link';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Course.name, schema: CourseSchema},
      {name: CourseData.name, schema: CourseDataSchema},
    ]),
    CloudinaryModule,
    UserModule,
    ReviewModule,
    CommentModule,
    LinkModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
  exports: [CourseService],
})
export class CourseModule {}
