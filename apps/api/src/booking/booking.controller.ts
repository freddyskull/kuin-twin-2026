import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto, UpdateBookingDto } from './dto/booking.dto';
import { BookingStatus } from '@prisma/client';

@Controller('api/bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createDto: CreateBookingDto) {
    return this.bookingService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('vendorId') vendorId?: string,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingService.findAll({ customerId, vendorId, status });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingDto,
  ) {
    return this.bookingService.updateStatus(id, updateDto);
  }
}
