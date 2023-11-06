import {AuthGuard} from '@/core';
import {Body, Controller, Delete, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {FileService} from './file.service';

@UseGuards(AuthGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  async getFiles(@Body() uuid: string): Promise<any> {
    return await this.fileService.findFile(uuid);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    return await this.fileService.uploadFile(file);
  }

  @Delete('delete')
  async deleteFile(@Body() publicId: string): Promise<any> {
    return await this.fileService.deleteFile(publicId);
  }

  @Post('upload-multiple')
  @UseInterceptors(FileInterceptor('files'))
  async uploadFiles(@UploadedFile() files: Express.Multer.File[]): Promise<any> {
    return await this.fileService.uploadFiles(files);
  }
}
