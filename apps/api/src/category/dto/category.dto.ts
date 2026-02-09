import { IsBoolean, IsOptional, IsString, IsUrl, IsUUID, Matches, MaxLength, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  name: string;

  @IsString()
  @MinLength(2, { message: 'El slug debe tener al menos 2 caracteres' })
  @Matches(/^[a-z0-9-]+$/, { message: 'El slug solo puede contener letras minúsculas, números y guiones' })
  slug: string;

  @IsString()
  @MaxLength(500, { message: 'La descripción no puede exceder los 500 caracteres' })
  @IsOptional()
  description?: string;

  @IsUrl({}, { message: 'URL de imagen inválida' })
  @IsOptional()
  imageUrl?: string;

  @IsUUID('4', { message: 'ID de categoría padre inválido' })
  @IsOptional()
  parentId?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
}

export type CreateCategoryInput = CreateCategoryDto;

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
