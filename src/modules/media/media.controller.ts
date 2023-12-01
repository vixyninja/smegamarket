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

  @Get(':mediaID')
  async getFile(@Param('mediaID') mediaID: string): Promise<any> {
    if (isUUID(mediaID) === false) {
      return {
        message: 'Media id is invalid',
        data: null,
      };
    }
    const result = await this.mediaService.readOne(mediaID);
    if (result) {
      return {
        message: 'Get media successfully',
        data: result,
      };
    }
  }

  @Post()
  @UseInterceptors(FileInterceptor('media'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const result = await this.mediaService.uploadFile(file, 'common');
    if (result) {
      return {
        message: 'Upload media successfully',
        data: result,
      };
    }
  }

  @Delete(':mediaId')
  async deleteFile(@Param('mediaId') mediaId: string): Promise<any> {
    if (isUUID(mediaId) === false) {
      return {
        message: 'Media id is invalid',
        data: null,
      };
    }

    const result = await this.mediaService.deleteFile(mediaId);
    if (result) {
      return {
        message: 'Delete media successfully',
        data: null,
      };
    }
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('medias'))
  async uploadFiles(@UploadedFiles() medias: Express.Multer.File[]): Promise<any> {
    const result = await this.mediaService.uploadFiles(medias);
    if (result) {
      return {
        message: 'Upload medias successfully',
        data: result,
      };
    }
  }
}
