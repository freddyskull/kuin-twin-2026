import { IsString, IsUUID, MinLength, IsOptional, IsNumber, IsPositive, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MetadataDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}

export class ScheduleDto {
  @IsString()
  day: string;

  @IsBoolean()
  enabled: boolean;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

export class HolidayRulesDto {
  @IsBoolean()
  workHolidays: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  whitelist?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  blacklist?: string[];
}

export class WorkScheduleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  @IsOptional()
  schedule?: ScheduleDto[];

  @ValidateNested()
  @Type(() => HolidayRulesDto)
  @IsOptional()
  holidayRules?: HolidayRulesDto;
}

export class CreateServiceDto {
  @IsUUID('4', { message: 'ID de vendedor inválido' })
  vendorId: string;

  @IsUUID('4', { message: 'ID de categoría inválido' })
  categoryId: string;

  @IsUUID('4', { message: 'ID de unidad inválido' })
  unitId: string;

  @IsString()
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[] = [];

  @IsString()
  @MinLength(10, { message: 'La descripción es muy corta' })
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsPositive({ message: 'El precio base debe ser mayor a 0' })
  @Type(() => Number)
  basePrice: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MetadataDto)
  @IsOptional()
  metadata?: MetadataDto[] = [];

  @IsString()
  @IsUUID('4', { message: 'ID de empresa inválido' })
  @IsOptional()
  companyId?: string;

  @IsOptional()
  dynamicAttributes?: any;

  @IsOptional()
  commentsBox?: any;

  @IsBoolean()
  @IsOptional()
  showPrice?: boolean = true;

  @ValidateNested()
  @Type(() => WorkScheduleDto)
  @IsOptional()
  workSchedule?: WorkScheduleDto;

  @IsArray()
  @IsOptional()
  slots?: any[] = [];
}
