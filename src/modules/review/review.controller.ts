import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {AdminGuard} from 'src/auth/guard';
import {ReviewService} from './review.service';

@UseGuards(AdminGuard)
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get('get-all')
  async getAllReviews() {
    return await this.reviewService.getReviews();
  }

  @Get('get-one/:id')
  async getReviewById(@Param('id') id: string) {
    return await this.reviewService.getReviewById(id);
  }
}
