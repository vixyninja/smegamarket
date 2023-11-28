import {AuthGuard} from '@/core';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {isUUID} from 'class-validator';
import {MediaService} from './media.service';

@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string): Promise<any> {
    if (isUUID(fileId) === false) {
      return {
        message: 'File id is invalid',
        data: null,
      };
    }
    const result = await this.mediaService.readOne(fileId);
    if (result) {
      return {
        message: 'Get file successfully',
        data: result,
      };
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const result = await this.mediaService.uploadFile(file);
    if (result) {
      return {
        message: 'Upload file successfully',
        data: result,
      };
    }
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<any> {
    if (isUUID(fileId) === false) {
      return {
        message: 'File id is invalid',
        data: null,
      };
    }

    const result = await this.mediaService.deleteFile(fileId);
    if (result) {
      return {
        message: 'Delete file successfully',
        data: null,
      };
    }
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]): Promise<any> {
    const result = await this.mediaService.uploadFiles(files);
    if (result) {
      return {
        message: 'Upload files successfully',
        data: result,
      };
    }
  }
}
