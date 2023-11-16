import {CloudinaryService} from '@/configs';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileEntity} from './file.entity';
import {HttpBadRequest} from '@/core';

interface FileServiceInterface {
  findFile(fileId: string): Promise<FileEntity>;
  uploadFile(file: Express.Multer.File): Promise<FileEntity>;
  deleteFile(fileId: string): Promise<any>;
  uploadFiles(files: Express.Multer.File[]): Promise<FileEntity[]>;
}

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findFile(fileId: string): Promise<FileEntity> {
    try {
      const file = await this.fileRepository.findOne({where: {uuid: fileId}});
      if (!file) throw new HttpBadRequest('File is not exist');
      return file;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
  async uploadFile(file: Express.Multer.File): Promise<FileEntity> {
    try {
      const result = await this.cloudinaryService.uploadFileImage(file);
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
      const fileResult = await this.fileRepository.save(fileEntity);
      return fileResult;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async deleteFile(fileId: string): Promise<any> {
    try {
      const file = await this.fileRepository.findOne({where: {uuid: fileId}});
      if (!file) throw new HttpBadRequest('File is not exist');
      await this.cloudinaryService.deleteFileImage(file.publicId);
      await this.fileRepository.delete(file.uuid);
      return true;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<FileEntity[]> {
    try {
      const result = await this.cloudinaryService.uploadMultipleFileImage(
        files,
      );
      const fileArray = [];
      for (const file of result) {
        const fileEntity = new FileEntity();
        fileEntity.publicId = file.public_id;
        fileEntity.signature = file.signature;
        fileEntity.version = file.version;
        fileEntity.width = file.width;
        fileEntity.height = file.height;
        fileEntity.format = file.format;
        fileEntity.resourceType = file.resource_type;
        fileEntity.url = file.url;
        fileEntity.secureUrl = file.secure_url;
        fileEntity.bytes = file.bytes;
        fileEntity.assetId = file.asset_id;
        fileEntity.versionId = file.version_id;
        fileEntity.tags = file.tags;
        fileEntity.etag = file.etag;
        fileEntity.placeholder = file.placeholder;
        fileEntity.originalFilename = file.original_filename;
        fileEntity.apiKey = file.api_key;
        fileEntity.folder = file.folder;
        fileArray.push(fileEntity);
      }
      const fileResult = await this.fileRepository.save(fileArray);
      return fileResult;
    } catch (e) {
      throw new HttpBadRequest(e.message);
    }
  }
}
