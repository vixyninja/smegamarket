import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {HttpInternalServerError} from 'src/core';
import {Comment, User} from 'src/models';
import {CreateCommentDTO, UpdateCommentDTO} from './dto';
import {UserService} from '../user';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    private readonly userService: UserService,
  ) {}

  async createComment(createCommentDTO: CreateCommentDTO) {
    try {
      return await this.commentModel.create({
        owner: await this.userService.findOneById(createCommentDTO.owner),
        comment: createCommentDTO.comment,
        like: [],
      });
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async deleteComment(user: User, commentId: string) {
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

  async updateComment(updateCommentDTO: UpdateCommentDTO, commentId: string) {
    try {
      return await this.commentModel.updateOne(
        {_id: commentId},
        {
          $set: {
            comment: updateCommentDTO.comment,
          },
        },
        {new: true},
      );
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async likeComment(user: User, commentId: string) {
    try {
      return await this.commentModel.updateOne({_id: commentId}, {$addToSet: {like: user}});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }

  async unlikeComment(user: User, commentId: string) {
    try {
      return await this.commentModel.updateOne({_id: commentId}, {$pull: {like: user}});
    } catch (e) {
      throw new HttpInternalServerError();
    }
  }
}
