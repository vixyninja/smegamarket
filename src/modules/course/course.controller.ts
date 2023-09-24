import {Body, Controller, Get, Param, Post, Put, SetMetadata, UploadedFile, UseInterceptors} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {IS_PUBLIC_KEY} from 'src/core';
import {CourseService} from './course.service';
import {CreateCourseDTO, CreateCourseDataDTO, UpdateCourseDTO} from './dto';
import {UpdateCourseDataDTO} from './dto/updateCourseDataDTO';

@Controller('course')
@SetMetadata(IS_PUBLIC_KEY, true)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  // ! CREATE
  // @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Post('create-course')
  async createCourse(@Body() body: CreateCourseDTO) {
    return this.courseService.createCourse(body);
  }

  @Post('create-course-data/:id')
  async createCourseData(@Param('id') id: string, @Body() body: CreateCourseDataDTO) {
    return this.courseService.createCourseData(body, id);
  }

  // ! READ
  @Get('get-all-courses')
  async getAllCourses() {
    return this.courseService.getAllCourses();
  }

  @Get('get-course/:id')
  async getCourseById(@Param('id') id: string) {
    return this.courseService.getCourseById(id);
  }

  @Get('get-course-data/:id')
  async getCourseDataById(@Param('id') id: string) {
    return this.courseService.getCourseDataById(id);
  }

  // ! UPDATE
  @Put('update-course-thumbnail/:id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateCourseThumbnail(@Param('id') id: string, @UploadedFile() thumbnail: Express.Multer.File) {
    return this.courseService.updateCourseThumbnail(id, thumbnail);
  }

  @Put('update-course-data-thumbnail/:id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateCourseDataThumbnail(@Param('id') id: string, @UploadedFile() thumbnail: Express.Multer.File) {
    return this.courseService.updateCourseThumbnail(id, thumbnail);
  }

  @Put('update-course/:id')
  async updateCourse(@Param('id') id: string, @Body() body: UpdateCourseDTO) {
    return this.courseService.updateCourseById(id, body);
  }

  @Put('update-course-data/:id')
  async updateCourseData(@Param('id') id: string, @Body() body: UpdateCourseDataDTO) {
    return this.courseService.updateCourseDataById(id, body);
  }

  // ! DELETE
  // @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Put('delete-course')
  async deleteCourse(@Body() body: {courseId: string}) {
    return this.courseService.deleteCourseById(body.courseId);
  }

  // @UseGuards(FirebaseAuthGuard, AdminGuard)
  @Put('delete-course-data')
  async deleteCourseData(@Body() body: {courseId: string; courseDataId: string}) {
    return this.courseService.deleteCourseDataById(body.courseId, body.courseDataId);
  }
}
