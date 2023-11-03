import {Controller, Get, Req} from '@nestjs/common';
import {Public} from './core';

@Controller()
export class AppController {
  constructor() {}
  @Get()
  @Public()
  getHello(): Object {
    return {
      data: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        env: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST,
      },
    };
  }
}
