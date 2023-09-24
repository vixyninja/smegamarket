import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {HttpInternalServerError} from 'src/core';
import {Review} from 'src/models';
import {CommentService} from '../comment';
import {UserService} from '../user';
import {CreateReviewDTO, UpdateReviewDTO} from './dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly commentService: CommentService,
    private readonly userService: UserService,
  ) {}

  async createReview(createReviewDTO: CreateReviewDTO) {
    try {
      return await this.reviewModel.create({
        user: await this.userService.findOneById(createReviewDTO.user),
        rating: createReviewDTO.rating || 0,
        comment: await this.commentService.createComment({
          ...createReviewDTO.comment,
        }),
        commentReply: [],
      });
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async getReviews() {
    try {
      return await this.reviewModel.find();
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async getReviewById(id: string) {
    try {
      return await this.reviewModel.findById(id);
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async getReviewByUserId(userId: string) {
    try {
      return await this.reviewModel.find({user: userId});
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async updateReviewById(reviewUpdateDTO: UpdateReviewDTO, reviewId: string) {
    try {
      return await this.reviewModel.findByIdAndUpdate(
        reviewId,
        {
          $set: {
            comment: reviewUpdateDTO.comment,
            rating: reviewUpdateDTO.rating,
          },
        },
        {new: true},
      );
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async updateReviewCommentById(reviewUpdateDTO: UpdateReviewDTO, reviewId: string) {
    try {
      return await this.reviewModel.findByIdAndUpdate(
        reviewId,
        {
          $addToSet: {
            commentReply: await this.commentService.createComment({
              ...reviewUpdateDTO.comment,
            }),
          },
        },
        {new: true},
      );
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async deleteReviewById(id: string) {
    try {
      return await this.reviewModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }
}
