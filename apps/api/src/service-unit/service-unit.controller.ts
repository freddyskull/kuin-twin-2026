import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ServiceUnitService } from './service-unit.service';
import { CreateServiceUnitDto, UpdateServiceUnitDto } from './dto/service-unit.dto';

@Controller('api/service-units')
export class ServiceUnitController {
  constructor(private readonly serviceUnitService: ServiceUnitService) {}

  @Post()
  async create(@Body() createDto: CreateServiceUnitDto) {
    return this.serviceUnitService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.serviceUnitService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.serviceUnitService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateServiceUnitDto,
  ) {
    return this.serviceUnitService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.serviceUnitService.remove(id);
  }
}
