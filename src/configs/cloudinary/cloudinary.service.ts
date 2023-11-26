import {Injectable} from '@nestjs/common';
import {UploadApiOptions, v2 as cloudinary} from 'cloudinary';
import {HttpBadRequest} from 'src/core';
import {CloudinaryResponse} from './typedef';
import {Environment} from '../environments';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFileImage(
    file: Express.Multer.File,
    folder: string = Environment.FOLDER_NAME,
  ): Promise<CloudinaryResponse> {
    const options: UploadApiOptions = {
      folder: folder,
      timestamp: Math.floor(Date.now() / 1000),
      unique_filename: true,
    };

    return new Promise((resolve, rejects) => {
      const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          rejects(new HttpBadRequest(error.message));
        }
      });
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFileImage(publicId: string): Promise<CloudinaryResponse> {
    return new Promise((resolve, rejects) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          rejects(new HttpBadRequest(error.message));
        }
      });
    });
  }

  async uploadMultipleFileImage(files: Express.Multer.File[], folder?: string): Promise<CloudinaryResponse[]> {
    let result: CloudinaryResponse[] = [];
    for await (const file of files) {
      result.push(await this.uploadFileImage(file, folder));
    }
    return result;
  }

  async deleteFolder(folder: string): Promise<CloudinaryResponse> {
    return new Promise((resolve, rejects) => {
      cloudinary.api.delete_resources_by_prefix(folder, (error, result) => {
        if (result) {
          resolve(result);
        } else {
          rejects(new HttpBadRequest(error.message));
        }
      });
    });
  }
}
