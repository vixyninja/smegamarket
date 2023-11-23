import {Injectable} from '@nestjs/common';
import {UploadApiOptions, v2 as cloudinary} from 'cloudinary';
import {HttpBadRequest} from 'src/core';
import {CloudinaryResponse} from './typedef';

const streamifier = require('streamifier');

@Injectable()
export class CloudinaryService {
  async uploadFileImage(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const options: UploadApiOptions = {
      folder: 'mega-storage',
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

  async uploadMultipleFileImage(files: Express.Multer.File[]): Promise<CloudinaryResponse[]> {
    // let result: CloudinaryResponse[] = [];
    // for await (const file of files) {
    // result.push(await this.uploadFileImage(file));
    // }
    // return result;
    return Promise.all(files.map(async (file) => await this.uploadFileImage(file)));
  }
}
