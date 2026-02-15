import { IsString, IsUUID, MinLength, IsOptional, IsNumber, IsPositive, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { sanitizeJsonObject } from 'shared-types';

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
  @IsOptional()
  unitId?: string;

  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MinLength(3, { message: 'El título debe tener al menos 3 caracteres' })
  title: string;

  @IsString({ message: 'El slug debe ser una cadena de texto' })
  @IsOptional()
  slug?: string;

  @IsArray({ message: 'Las etiquetas deben ser un arreglo' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser una cadena de texto' })
  @IsOptional()
  tags?: string[] = [];

  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, { message: 'La descripción es muy corta (mínimo 10 caracteres)' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  @IsOptional()
  imageUrl?: string;

  @IsNumber({}, { message: 'El precio base debe ser un número' })
  @IsOptional()
  @Type(() => Number)
  basePrice?: number = 0;

  @IsBoolean({ message: 'El estado activo debe ser un booleano' })
  @IsOptional()
  isActive?: boolean = true;

  @IsArray({ message: 'Los metadatos deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => MetadataDto)
  @IsOptional()
  metadata?: MetadataDto[] = [];

  @IsString({ message: 'El ID de empresa debe ser una cadena de texto' })
  @IsUUID('4', { message: 'ID de empresa inválido' })
  @IsOptional()
  companyId?: string;

  @IsOptional()
  @Transform(({ value }) => sanitizeJsonObject(value))
  dynamicAttributes?: any;

  @IsOptional()
  commentsBox?: any;

  @IsBoolean({ message: 'El campo mostrar precio debe ser un booleano' })
  @IsOptional()
  showPrice?: boolean = true;

  @ValidateNested()
  @Type(() => WorkScheduleDto)
  @IsOptional()
  workSchedule?: WorkScheduleDto;

  @IsArray({ message: 'Los slots deben ser un arreglo' })
  @IsOptional()
  slots?: any[] = [];

  @IsArray({ message: 'Las sucursales deben ser un arreglo' })
  @IsUUID('4', { each: true, message: 'ID de sucursal inválido' })
  @IsOptional()
  branchIds?: string[] = [];
}
