import {Body, Controller, Get, Headers, Post, Req, UploadedFile, UseGuards, UseInterceptors} from '@nestjs/common';
import {FirebaseAuthGuard} from 'src/auth/firebase/firebase-guard.guard';
import {UserService} from './user.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {UpdatePasswordDTO} from './dto/updatePasswordDTO';
import {UpdateProfileDTO} from './dto/updateUserDTO';

@UseGuards(FirebaseAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async me(@Req() req: any) {
    return await this.userService.me(req['user'].user_id);
  }

  @Post('update-profile')
  async updateProfile(@Body() body: UpdateProfileDTO, @Req() req: any) {
    return await this.userService.updateProfile(req['user'].user_id, body);
  }

  @Post('update-password')
  async updatePassword(@Body() body: any, @Req() req: any) {
    const updatePasswordDTO = new UpdatePasswordDTO(body.oldPassword, body.newPassword);
    return await this.userService.updatePassword(req['user'].email, updatePasswordDTO);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    return await this.userService.updateProfilePicture(req['user'].user_id, file);
  }
}
