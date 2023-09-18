import {Controller, Get, Req, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {FirebaseAuthGuard} from 'src/auth/firebase/firebase-guard.guard';

@UseGuards(FirebaseAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async me(@Req() req: any) {
    return await this.userService.me(req['user'].user_id);
  }
}
