import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {HttpBadRequest, HttpInternalServerError} from 'src/core';
import {Comment, Review, User} from 'src/models';
import {CommentService} from '../comment';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>,
    private readonly commentService: CommentService,
  ) {}

  async createReview(review: Review, comment: string, user: User) {
    try {
      const newComment = await this.commentService.createComment(user, comment);
      if (!newComment) {
        throw new HttpBadRequest('Comment is not created');
      }
      return await this.reviewModel.create({
        user: user,
        comment: newComment,
        rating: review.rating,
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

  async updateReviewById(id: string, review: Review) {
    try {
      return await this.reviewModel.findByIdAndUpdate(id, review, {new: true});
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
