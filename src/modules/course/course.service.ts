import {fakerVI} from '@faker-js/faker';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model, Types} from 'mongoose';
import {CloudinaryService} from 'src/configs';
import {HttpInternalServerError} from 'src/core';
import {HttpCreatedResponse} from 'src/interface';
import {Course, CourseData} from 'src/models';
import {LinkService} from '../link';
import {CommentService} from '../comment';
import {ReviewService} from '../review';
import {UserService} from '../user';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(CourseData.name) private readonly courseDataModel: Model<CourseData>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly linkService: LinkService,
    private readonly commentService: CommentService,
    private readonly reviewService: ReviewService,
    private readonly userService: UserService,
  ) {}

  async createCourse(course: Course, thumbnail: Express.Multer.File, email: any) {
    try {
      const user = await this.userService.findOneByEmail(email);
      // upload image to cloudinary
      const uploadImage = await this.cloudinaryService.uploadFileImage(thumbnail);
      const newLink = await this.linkService.createLink({
        title: fakerVI.lorem.sentence(3),
        url: fakerVI.internet.url(),
      });
      const newComment = await this.commentService.createComment(user, fakerVI.lorem.paragraphs(3));
      const newReplyComment = await this.commentService.createComment(user, fakerVI.lorem.paragraphs(3));
      const newReview = await this.reviewService.createReview(
        {
          rating: fakerVI.number.int(100),
          comment: [newComment],
          user: user,
          commentReply: [newReplyComment],
        },
        fakerVI.lorem.paragraphs(3),
        user,
      );
      // create course
      const newCourseData = await this.courseDataModel.create({
        description: fakerVI.lorem.paragraphs(3),
        links: [newLink],
        title: fakerVI.lorem.sentence(3),
        videoDuration: fakerVI.number.int(100),
        videoPlayer: fakerVI.internet.url(),
        videoSelection: fakerVI.internet.url(),
        videoThumbnail: {
          public_id: uploadImage.public_id,
          url: uploadImage.url,
        },
        videoURL: fakerVI.internet.url(),
      });
      const newCourse = await this.courseModel.create({
        benefits: fakerVI.lorem.paragraphs(3),
        description: fakerVI.lorem.paragraphs(3),
        courseData: [newCourseData],
        name: fakerVI.lorem.sentence(3),
        demoURL: fakerVI.internet.url(),
        discount: fakerVI.number.int(100),
        isPublished: fakerVI.helpers.arrayElement([true, false]),
        level: fakerVI.lorem.sentence(3),
        prerequisites: fakerVI.lorem.paragraphs(3),
        price: fakerVI.number.int(100),
        purchased: fakerVI.number.int(100),
        rating: fakerVI.number.int(100),
        tags: [fakerVI.lorem.sentence(3), fakerVI.lorem.sentence(3)],
        thumbnail: {
          public_id: uploadImage.public_id,
          url: uploadImage.url,
        },
        reviews: [newReview],
      });

      return new HttpCreatedResponse<any>(newCourse, 'Create course successfully');
    } catch (e) {
      console.log(e);
      throw new HttpInternalServerError();
    }
  }
}