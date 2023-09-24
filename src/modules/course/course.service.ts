import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, isValidObjectId} from 'mongoose';
import {CloudinaryService, RedisxService} from 'src/configs';
import {HttpBadRequest, HttpInternalServerError} from 'src/core';
import {HttpCreatedResponse, HttpOk, HttpResponse} from 'src/interface';
import {Course, CourseData} from 'src/models';
import {CommentService} from '../comment';
import {LinkService} from '../link';
import {ReviewService} from '../review';
import {UserService} from '../user';
import {CreateCourseDTO, CreateCourseDataDTO, UpdateCourseDTO, UpdateCourseDataDTO} from './dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(CourseData.name)
    private readonly courseDataModel: Model<CourseData>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly linkService: LinkService,
    private readonly commentService: CommentService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
    private readonly redisService: RedisxService,
  ) {}

  // ! CREATE
  async createCourse(body: CreateCourseDTO) {
    try {
      // create course
      const course = await this.courseModel.create({
        ...body,
        courseData: [],
      });

      // return success
      return new HttpCreatedResponse<any>(course, 'Create course successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async createCourseData(createCourseDataDTO: CreateCourseDataDTO, id: string) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }

      // create course data
      const courseData = await this.courseDataModel.create({
        ...createCourseDataDTO,
        videoThumbnail: {
          public_id: '',
          url: '',
        },
        links: [],
      });

      // push course data to course
      await this.courseModel.findByIdAndUpdate(id, {
        $push: {courseData: courseData._id},
      });

      // return success
      return new HttpCreatedResponse<any>(courseData, 'Create course data successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  // ! READ
  async getAllCourses() {
    try {
      // init courses variable
      let courses: any;

      // check courses found in redis
      courses = await this.redisService.getKey('courses');

      // return courses if found in redis
      if (courses) {
        return new HttpResponse<any>(200, courses, courses.length + ' courses');
      }

      // check courses found in mongodb
      courses = await this.courseModel.find().populate('courseData');

      // return error if courses not found
      if (!courses) {
        return new HttpBadRequest('Courses not found');
      }

      // set courses in redis
      await this.redisService.setKey('courses', JSON.stringify(courses), 60 * 60);

      // return courses
      return new HttpResponse<any>(200, courses, courses.length + ' courses');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async getCourseById(id: string) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }

      // init course variable
      let course: any;

      // check course found in redis
      course = await this.redisService.getKey(id);

      // return course if found in redis
      if (course) {
        return new HttpResponse<any>(200, JSON.parse(course), 'Get course successfully');
      }

      // check course found in mongodb
      course = await this.courseModel.findById(id).populate('courseData');

      // return error if course not found
      if (!course) {
        return new HttpBadRequest('Course not found');
      }

      // set course in redis
      await this.redisService.setKey(id, JSON.stringify(course), 60 * 60);

      // return course
      return new HttpResponse<any>(200, course, 'Get course successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async getCourseDataById(id: string) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }
      // init course data variable
      let courseData: any;

      // check course data found in redis
      courseData = await this.redisService.getKey(id);

      // return course data if found in redis
      if (courseData) {
        return new HttpResponse<any>(200, JSON.parse(courseData), 'Get course data successfully');
      }

      // check course data found in mongodb
      courseData = await this.courseDataModel.findById(id);

      // return error if course data not found
      if (!courseData) {
        return new HttpBadRequest('Course data not found');
      }

      // set course data in redis
      await this.redisService.setKey(id, JSON.stringify(courseData), 60 * 60);

      // return course data
      return new HttpResponse<any>(200, courseData, 'Get course data successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  // ! UPDATE
  async updateCourseById(id: string, updateCourseDTO: UpdateCourseDTO) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }

      // check course found
      const course = await this.courseModel.findById(id);

      // return error if course not found
      course.$isEmpty('Course not found');

      // execute update course
      const executeUpdateCourse = await course.updateOne({
        $set: {
          ...updateCourseDTO,
        },
      });

      // return error if update course fail
      if (!executeUpdateCourse.$isUpdated) {
        return new HttpBadRequest("Can't update course");
      }

      // remove course data in redis
      await this.redisService.delKey(id);

      // return success
      return new HttpResponse<any>(200, course, 'Update course successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async updateCourseDataById(id: string, updateCourseDataDTO: UpdateCourseDataDTO) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }

      // check course data found
      const course = await this.courseModel.findById(id);

      // return error if course data not found
      course.$isEmpty('Course data not found');

      // execute update course data
      const executeUpdateCourseData = await course.updateOne({
        $set: {
          ...updateCourseDataDTO,
        },
      });

      // return error if update course data fail
      if (!executeUpdateCourseData.$isUpdated) {
        return new HttpBadRequest("Can't update course data");
      }

      // remove course data in redis
      await this.redisService.delKey(id);

      // return success
      return new HttpResponse<any>(200, course, 'Update course data successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async updateCourseThumbnail(id: string, thumbnail: Express.Multer.File) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }

      // check course found
      const course = await this.courseModel.findById(id);

      // return error if course not found
      course.$isEmpty('Course not found');

      // Delete old thumbnail
      if (course.thumbnail.public_id.toString().length > 0) {
        await this.cloudinaryService.deleteFileImage(course.thumbnail.public_id.toString());
      }
      // Update new thumbnail
      const thumbnailUrl = await this.cloudinaryService.uploadFileImage(thumbnail);

      // execute update thumbnail
      const executeUpdateThumbnail = await course.updateOne({
        $set: {
          thumbnail: {
            public_id: thumbnailUrl.public_id,
            url: thumbnailUrl.url,
          },
        },
      });

      // return error if update thumbnail fail
      if (!executeUpdateThumbnail) {
        return new HttpBadRequest("Can't update thumbnail");
      }

      // remove course data in redis
      await this.redisService.delKey(id);

      // return success
      return new HttpOk('Update thumbnail successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async updateCourseDataThumbnail(id: string, thumbnail: Express.Multer.File) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }
      // check course data found
      const courseData = await this.courseDataModel.findById(id).exec();

      // return error if course data not found
      courseData.$isEmpty('Course data not found');

      // Delete old thumbnail
      if (courseData.videoThumbnail.public_id.toString().length > 0) {
        await this.cloudinaryService.deleteFileImage(courseData.videoThumbnail.public_id.toString());
      }

      // Update new thumbnail
      const thumbnailUrl = await this.cloudinaryService.uploadFileImage(thumbnail);

      // return error if update thumbnail fail
      if (!thumbnailUrl) {
        return new HttpBadRequest("Can't update thumbnail");
      }

      // execute update thumbnail
      const executeUpdateThumbnail = await courseData.updateOne({
        $set: {
          videoThumbnail: {
            public_id: thumbnailUrl.public_id,
            url: thumbnailUrl.url,
          },
        },
      });

      // return error if update thumbnail fail
      if (!executeUpdateThumbnail) {
        return new HttpBadRequest("Can't update thumbnail");
      }

      // remove course data in redis
      await this.redisService.delKey(id);

      // return success
      return new HttpOk('Update thumbnail successfully');
    } catch (e) {
      console.log(e);

      throw new HttpInternalServerError();
    }
  }

  // ! DELETE
  async deleteCourseById(id: string) {
    try {
      // check valid objectID
      if (isValidObjectId(id) === false) {
        return new HttpBadRequest('Invalid id');
      }
      // check course found
      const course = await this.courseModel.findById(id).exec();

      // return error if course not found
      course.$isEmpty('Course not found');

      // Delete course
      const executeDeleteCourse = await course.deleteOne();

      // return error if delete course fail
      if (!executeDeleteCourse.$isDeleted) {
        return new HttpBadRequest("Can't delete course");
      }

      // todo: FUTURE WORK
      // Delete all comment of course
      // Delete all link of course
      // Delete all review of course
      // Delete all course data of course

      // remove course data in redis
      await this.redisService.delKey(id);

      // return success
      return new HttpOk('Delete course successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async deleteCourseDataById(courseId: string, courseDataId: string) {
    try {
      // check valid objectID
      if (isValidObjectId(courseId) === false) {
        return new HttpBadRequest('Invalid id');
      }

      // check course found
      const course = await this.courseModel.findById(courseId).exec();

      // return error if course not found
      course.$isEmpty('Course not found');
      // check course data found
      const courseData = await this.courseDataModel.findById(courseDataId).exec();

      // return error if course data not found
      courseData.$isEmpty('Course data not found');
      // Delete course data
      const executeDeleteCourseData = await courseData.deleteOne();

      // Delete course data in course
      await course.updateOne({
        $pull: {courseData: courseDataId},
      });

      // todo: FUTURE WORK
      // Delete all comment of course data
      // Delete all link of course data
      // Delete all review of course data
      // Delete all videoThumbnail of course data in cloudinary

      // return error if delete course data fail
      if (!executeDeleteCourseData) {
        return new HttpBadRequest("Can't delete course data");
      }

      // remove course data in redis
      await this.redisService.delKey(courseDataId);
      await this.redisService.delKey(courseId);

      // return success
      return new HttpOk('Delete course data successfully');
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }
}
