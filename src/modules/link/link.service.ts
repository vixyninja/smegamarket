import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {HttpInternalServerError} from 'src/core';
import {Link} from 'src/models';

@Injectable()
export class LinkService {
  constructor(@InjectModel(Link.name) private readonly linkModel: Model<Link>) {}

  async createLink(link: Link) {
    try {
      return await this.linkModel.create(link);
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async getLinks() {
    try {
      return await this.linkModel.find();
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async getLinkById(id: string) {
    try {
      return await this.linkModel.findById(id);
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async updateLinkById(id: string, link: Link) {
    try {
      return await this.linkModel.findByIdAndUpdate(id, link, {new: true});
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }

  async deleteLinkById(id: string) {
    try {
      return await this.linkModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpInternalServerError();
    }
  }
}
