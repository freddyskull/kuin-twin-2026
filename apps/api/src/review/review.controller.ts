import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() createDto: CreateReviewDto) {
    const userId = req.user.userId;
    return this.reviewService.create(userId, createDto);
  }

  @Get('service/:serviceId')
  async findByService(@Param('serviceId') serviceId: string) {
    return this.reviewService.findByService(serviceId);
  }
}
