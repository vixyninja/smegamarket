import {CloudinaryService, Environment} from '@/configs';
import {HttpBadRequest, HttpInternalServerError} from '@/core';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateMediaDTO} from './dto';
import {MediaEntity} from './entities';
import {IMediaService} from './interfaces';

@Injectable()
export class MediaService implements IMediaService {
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
      throw e;
    }
  }

  async readOne(fileId: string): Promise<any> {
    try {
      const file = await this.mediaRepository.createQueryBuilder('media').where({uuid: fileId}).getOne();

      if (!file) throw new HttpBadRequest('Media is not exist');

      return file;
    } catch (e) {
      throw e;
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

      const builder = new CreateMediaDTO({
        publicId: public_id,
        signature: signature,
        version: version,
        width: width,
        height: height,
        format: format,
        resourceType: resource_type,
        url: url,
        secureUrl: secure_url,
        bytes: bytes,
        assetId: asset_id,
        versionId: version_id,
        tags: tags,
        etag: etag,
        placeholder: placeholder,
        originalFilename: original_filename,
        apiKey: api_key,
        folder: folder ?? Environment.FOLDER_NAME,
      });

      const fileResult = await this.mediaRepository
        .createQueryBuilder('media')
        .insert()
        .into(MediaEntity)
        .values(builder)
        .execute();

      const fileResponse = await this.findFile(fileResult.raw[0].uuid);

      if (!fileResponse) throw new HttpBadRequest('Media upload failed');

      return fileResponse;
    } catch (e) {
      throw e;
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

        const builder = new CreateMediaDTO({
          publicId: public_id,
          signature: signature,
          version: version,
          width: width,
          height: height,
          format: format,
          resourceType: resource_type,
          url: url,
          secureUrl: secure_url,
          bytes: bytes,
          assetId: asset_id,
          versionId: version_id,
          tags: tags,
          etag: etag,
          placeholder: placeholder,
          originalFilename: original_filename,
          apiKey: api_key,
          folder: folder ?? Environment.FOLDER_NAME,
        });

        const fileResult = await this.mediaRepository
          .createQueryBuilder('media')
          .insert()
          .into(MediaEntity)
          .values(builder)
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
      throw e;
    }
  }

  async deleteFolder(folder: string): Promise<any> {
    try {
      const result = await this.cloudinaryService.deleteFolder(folder);

      await this.mediaRepository.createQueryBuilder('media').softDelete().where({folder: folder}).execute();

      return result;
    } catch (e) {
      throw e;
    }
  }
}
