import { IsInt, IsOptional, IsString, IsUrl, Max, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para la creación de un perfil
 */
export class CreateProfileDto {
  @IsString()
  @MinLength(2, { message: 'El nombre mostrado debe tener al menos 2 caracteres' })
  displayName: string;

  @IsString()
  @MaxLength(500, { message: 'La biografía no puede exceder los 500 caracteres' })
  @IsOptional()
  bio?: string;

  @IsUrl({}, { message: 'URL de avatar inválida' })
  @IsOptional()
  avatarUrl?: string;

  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  @Type(() => Number)
  serviceRadiusKm?: number = 10;

  @IsOptional()
  businessHours?: any; // JSON
}

export type CreateProfileInput = CreateProfileDto;
