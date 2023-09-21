import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {HttpInternalServerError} from 'src/core';
import {Comment, User} from 'src/models';

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment.name) private readonly commentModel: Model<Comment>) {}

  async createComment(user: User, comment: string) {
    try {
      return await this.commentModel.create({
        owner: user,
        comment: comment,
      });
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async deleteComment(commentId: string, user: User) {
    try {
      return await this.commentModel.deleteOne({
        _id: commentId,
        owner: user,
      });
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

  async updateComment(commentId: string, content: string, user: User) {
    try {
      return await this.commentModel.updateOne({_id: commentId, user: user}, {comment: content});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async likeComment(commentId: string, user: User) {
    try {
      return await this.commentModel.updateOne({_id: commentId}, {$set: {like: user}});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async unlikeComment(commentId: string, user: User) {
    try {
      return await this.commentModel.updateOne({_id: commentId}, {$pull: {like: user}});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }
}
