import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CloudinaryModule} from 'src/configs';
import {Course, CourseData, CourseDataSchema, CourseSchema} from 'src/models';
import {CourseController} from './course.controller';
import {CourseService} from './course.service';
import {UserModule} from '../user';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: CourseData.name,
        schema: CourseDataSchema,
      },
    ]),
    UserModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
