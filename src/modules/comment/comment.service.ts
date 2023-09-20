import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {HttpInternalServerError} from 'src/core';
import {Comment} from 'src/models';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private readonly commentModel: Model<Comment>) {}

  async createComment(userId: string, content: string) {
    try {
      const comment = new this.commentModel({
        user: userId,
        comment: content,
        like: [],
      });
      return await comment.save();
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async deleteComment(commentId: string, userId: string) {
    try {
      return await this.commentModel.deleteOne({_id: commentId, user: userId});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async forceDeleteComment(commentId: string) {
    try {
      return await this.commentModel.deleteOne({_id: commentId});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async updateComment(commentId: string, content: string, userId: string) {
    try {
      return await this.commentModel.updateOne({_id: commentId, user: userId}, {comment: content});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async likeComment(commentId: string, userId: string) {
    try {
      return await this.commentModel.updateOne({_id: commentId}, {$set: {like: userId}});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async unlikeComment(commentId: string, userId: string) {
    try {
      return await this.commentModel.updateOne({_id: commentId}, {$pull: {like: userId}});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }
}
