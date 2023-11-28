import {CloudinaryService, Environment} from '@/configs';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {HttpBadRequest, HttpInternalServerError} from '@/core';
import {MediaEntity} from './entities';

interface MediaServiceInterface {
  findFile(fileId: string): Promise<any>;
  readOne(fileId: string): Promise<any>;
  uploadFile(file: Express.Multer.File, folder?: string): Promise<any>;
  uploadFiles(files: Express.Multer.File[], folder?: string): Promise<any>;
  deleteFile(fileId: string): Promise<any>;
  deleteFolder(folder: string): Promise<any>;
}

@Injectable()
export class MediaService implements MediaServiceInterface {
  constructor(
    @InjectRepository(MediaEntity)
    private readonly mediaRepository: Repository<MediaEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findFile(fileId: string): Promise<any> {
    try {
      const file = await this.mediaRepository.createQueryBuilder('media').where({uuid: fileId}).getOne();

      return file;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async readOne(fileId: string): Promise<any> {
    try {
      const file = await this.mediaRepository.createQueryBuilder('media').where({uuid: fileId}).getOne();

      if (!file) throw new HttpBadRequest('Media is not exist');

      return file;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async uploadFile(file: Express.Multer.File, folder?: string): Promise<any> {
    try {
      const result = await this.cloudinaryService.uploadFileImage(file, folder);

      var {
        public_id,
        signature,
        version,
        width,
        height,
        format,
        resource_type,
        url,
        secure_url,
        bytes,
        asset_id,
        version_id,
        tags,
        etag,
        placeholder,
        original_filename,
        api_key,
      } = result;

      const fileResult = await this.mediaRepository
        .createQueryBuilder('media')
        .insert()
        .into(MediaEntity)
        .values({
          publicId: public_id,
          signature,
          version,
          width,
          height,
          format,
          resourceType: resource_type,
          url,
          secureUrl: secure_url,
          bytes,
          assetId: asset_id,
          versionId: version_id,
          tags,
          etag,
          placeholder,
          originalFilename: original_filename,
          apiKey: api_key,
          folder: folder ?? Environment.FOLDER_NAME,
        })
        .execute();

      const fileResponse = await this.findFile(fileResult.raw[0].uuid);

      return fileResponse ?? null;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async uploadFiles(files: Express.Multer.File[], folder?: string): Promise<any> {
    try {
      const results = await this.cloudinaryService.uploadMultipleFileImage(files, folder);

      let fileResults = [];

      for await (const result of results) {
        var {
          public_id,
          signature,
          version,
          width,
          height,
          format,
          resource_type,
          url,
          secure_url,
          bytes,
          asset_id,
          version_id,
          tags,
          etag,
          placeholder,
          original_filename,
          api_key,
        } = result;

        const fileResult = await this.mediaRepository
          .createQueryBuilder('media')
          .insert()
          .into(MediaEntity)
          .values({
            publicId: public_id,
            signature,
            version,
            width,
            height,
            format,
            resourceType: resource_type,
            url,
            secureUrl: secure_url,
            bytes,
            assetId: asset_id,
            versionId: version_id,
            tags,
            etag,
            placeholder,
            originalFilename: original_filename,
            apiKey: api_key,
            folder: folder ?? Environment.FOLDER_NAME,
          })
          .execute();

        fileResults.push(await this.findFile(fileResult.raw[0].uuid));
      }

      return fileResults;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteFile(fileId: string): Promise<any> {
    try {
      const file = await this.findFile(fileId);

      if (!file) throw new HttpBadRequest('Media is not exist');

      await this.mediaRepository.createQueryBuilder('media').softDelete().where({uuid: fileId}).execute();

      return true;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }

  async deleteFolder(folder: string): Promise<any> {
    try {
      const result = await this.cloudinaryService.deleteFolder(folder);

      await this.mediaRepository.createQueryBuilder('media').softDelete().where({folder: folder}).execute();

      return result;
    } catch (e) {
      throw new HttpInternalServerError(e.message);
    }
  }
}
