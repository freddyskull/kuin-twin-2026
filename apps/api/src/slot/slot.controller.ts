import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SlotService } from './slot.service';
import { CreateSlotDto, UpdateSlotDto } from './dto/slot.dto';

@Controller('api/slots')
export class SlotController {
  constructor(private readonly slotService: SlotService) {}

  @Post()
  async create(@Body() createSlotDto: CreateSlotDto) {
    return this.slotService.create(createSlotDto);
  }

  @Get('service/:serviceId')
  async findAll(
    @Param('serviceId') serviceId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.slotService.findAll(
      serviceId,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.slotService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSlotDto: UpdateSlotDto,
  ) {
    return this.slotService.update(id, updateSlotDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.slotService.remove(id);
  }
}
