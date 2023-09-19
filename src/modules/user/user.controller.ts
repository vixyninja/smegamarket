import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {ThrottlerGuard} from '@nestjs/throttler';
import {FirebaseAuthGuard} from 'src/auth/firebase/firebase-guard.guard';
import {UserService} from './user.service';

@UseGuards(FirebaseAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async me(@Req() req: any) {
    return await this.userService.me(req['user'].user_id);
  }

  @Get('test')
  async test() {
    return {
      message: 'test',
    };
  }
}
