import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ThrottlerGuard} from '@nestjs/throttler';
import {FirebaseAuthGuard} from 'src/auth/firebase/firebase-guard.guard';
import {UserService} from './user.service';

@UseGuards(FirebaseAuthGuard)
@Controller('user')
export class UserController {
  static count = 0;
  constructor(private readonly userService: UserService) {}

  @UseGuards(ThrottlerGuard)
  @Get()
  async me(@Req() req: any) {
    UserController.count++;

    console.log('UserController.count', UserController.count);
    return await this.userService.me(req['user'].user_id);
  }
}
