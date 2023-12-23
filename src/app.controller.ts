import {Controller, Get} from '@nestjs/common';
import {Public} from './core';
import {UserMailService} from './modules';

@Controller()
export class AppController {
  constructor(private readonly UserMailService: UserMailService) {}

  @Get()
  @Public()
  getHello() {
    return {
      data: {
        timestamp: new Date().toISOString(),
        version: '0.0.1',
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST,
      },
    };
  }

  @Get('ping')
  @Public()
  async ping() {
    return await this.UserMailService.ping();
  }
}
