import { Module } from '@nestjs/common';
import { SlideshowService } from './slideshow.service';
import { SlideshowController } from './slideshow.controller';

@Module({
  controllers: [SlideshowController],
  providers: [SlideshowService],
})
export class SlideshowModule {}
