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
import type { CreateBookingInput, UpdateBookingInput, BookingStatus } from 'shared-types';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  async create(@Body() createDto: CreateBookingInput) {
    return this.bookingService.create(createDto);
  }

  @Get()
  async findAll(
    @Query('customerId') customerId?: string,
    @Query('vendorId') vendorId?: string,
    @Query('status') status?: BookingStatus,
  ) {
    return this.bookingService.findAll({ customerId, vendorId, status: status as any });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateBookingInput,
  ) {
    return this.bookingService.updateStatus(id, updateDto as any);
  }
}
