import {CloudinaryService} from '@/configs';
import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FileEntity} from './file.entity';

interface FileServiceInterface {
  uploadFile(file: any): Promise<any>;
  deleteFile(publicId: string): Promise<any>;
  uploadFiles(files: any[]): Promise<any>;
}

@Injectable()
export class FileService implements FileServiceInterface {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadFile(file: Express.Multer.File): Promise<any> {
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
      await this.fileRepository.save(fileEntity);
      return {
        data: result,
        message: 'Upload file successfully',
      };
    }
    return {
      data: null,
      message: 'Upload file failed',
    };
  }

  async deleteFile(publicId: string): Promise<any> {
    const result = await this.cloudinaryService.deleteFileImage(publicId);
    if (result) {
      await this.fileRepository.delete({publicId});
      return {
        message: 'Delete file successfully',
      };
    }
    return {
      message: 'Delete file failed',
    };
  }

  async uploadFiles(files: Express.Multer.File[]): Promise<any> {
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
      await this.fileRepository.save(fileEntities);
      return {
        data: result,
        message: 'Upload files successfully',
      };
    }
    return {
      data: null,
      message: 'Upload files failed',
    };
  }
}
