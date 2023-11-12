import {CloudinaryService} from '@/configs';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileEntity} from './file.entity';
import {HttpBadRequest} from '@/core';

interface FileServiceInterface {
  findFile(publicId: string): Promise<FileEntity>;
  uploadFile(file: any): Promise<any>;
  deleteFile(fileId: string): Promise<any>;
  uploadFiles(files: any[]): Promise<any>;
}

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findFile(uuid: string): Promise<FileEntity> {
    try {
      return await this.fileRepository.findOne({where: {uuid: uuid}});
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<any> {
    try {
      const result = await this.cloudinaryService.uploadFileImage(file);
      if (result) {
        const fileEntity = new FileEntity();
        fileEntity.publicId = result.public_id;
        fileEntity.signature = result.signature;
        fileEntity.version = result.version;
        fileEntity.width = result.width;
        fileEntity.height = result.height;
        fileEntity.format = result.format;
        fileEntity.resourceType = result.resource_type;
        fileEntity.url = result.url;
        fileEntity.secureUrl = result.secure_url;
        fileEntity.bytes = result.bytes;
        fileEntity.assetId = result.asset_id;
        fileEntity.versionId = result.version_id;
        fileEntity.tags = result.tags;
        fileEntity.etag = result.etag;
        fileEntity.placeholder = result.placeholder;
        fileEntity.originalFilename = result.original_filename;
        fileEntity.apiKey = result.api_key;
        fileEntity.folder = result.folder;
        const fileUpLoad = await this.fileRepository.save(fileEntity);
        return fileUpLoad;
      }
      return null;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<any> {
    try {
      const result = await this.cloudinaryService.uploadMultipleFileImage(files);
      if (result) {
        const fileEntities = [];
        result.forEach((item) => {
          const fileEntity = new FileEntity();
          fileEntity.publicId = item.public_id;
          fileEntity.signature = item.signature;
          fileEntity.version = item.version;
          fileEntity.width = item.width;
          fileEntity.height = item.height;
          fileEntity.format = item.format;
          fileEntity.resourceType = item.resource_type;
          fileEntity.url = item.url;
          fileEntity.secureUrl = item.secure_url;
          fileEntity.bytes = item.bytes;
          fileEntity.assetId = item.asset_id;
          fileEntity.versionId = item.version_id;
          fileEntity.tags = item.tags;
          fileEntity.etag = item.etag;
          fileEntity.placeholder = item.placeholder;
          fileEntity.originalFilename = item.original_filename;
          fileEntity.apiKey = item.api_key;
          fileEntity.folder = item.folder;
          fileEntities.push(fileEntity);
        });
        const fileUploads = await this.fileRepository.save(fileEntities);
        return fileUploads;
      }
      return null;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async deleteFile(fileId: string): Promise<boolean> {
    try {
      const file = await this.fileRepository.findOne({where: {uuid: fileId}});
      if (!file) {
        return false;
      }
      await this.cloudinaryService.deleteFileImage(file.publicId);
      await this.fileRepository.delete(file.uuid);
      return true;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
