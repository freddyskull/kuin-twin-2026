import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { SatService } from './sat.service';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly satService: SatService,
  ) {}

  @Get('verify-sat/:rfc')
  @ApiOperation({ summary: 'Verificar RFC ante el SAT (Simulado)' })
  verifySat(@Param('rfc') rfc: string) {
    return this.satService.verifyRfc(rfc);
  }

  @Post()
  @ApiOperation({ summary: 'Crear empresa' })
  @ApiResponse({ status: 201, description: 'Empresa creada exitosamente' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las empresas' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una empresa' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una empresa' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
