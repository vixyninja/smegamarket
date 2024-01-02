import { Controller } from '@nestjs/common';
import { SlideshowService } from './slideshow.service';

@Controller('slideshow')
export class SlideshowController {
  constructor(private readonly slideshowService: SlideshowService) {}
}
