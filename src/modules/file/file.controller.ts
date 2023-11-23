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
import {FileService} from './file.service';
import {isUUID} from 'class-validator';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string): Promise<any> {
    if (isUUID(fileId) === false) {
      return {
        message: 'File id is invalid',
        data: null,
      };
    }
    const result = await this.fileService.findFile(fileId);
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
    const result = await this.fileService.uploadFile(file);
    if (result) {
      return {
        message: 'Upload file successfully',
        data: result,
      };
    }
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string): Promise<any> {
    const result = await this.fileService.deleteFile(fileId);
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
    const result = await this.fileService.uploadFiles(files);
    if (result) {
      return {
        message: 'Upload files successfully',
        data: result,
      };
    }
  }
}
