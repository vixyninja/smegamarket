import {Body, Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {CourseService} from './course.service';
import {FirebaseAuthGuard} from 'src/auth/firebase';
import {FileInterceptor} from '@nestjs/platform-express';
import {AdminGuard} from 'src/auth/guard';

@Controller('course')
@UseGuards(FirebaseAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(AdminGuard)
  @Post('create-course')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createCourse(@Body() body: any, @UploadedFile() thumbnail: Express.Multer.File, @Req() req: any) {
    return this.courseService.createCourse(body, thumbnail, req.user.email);
  }
}
