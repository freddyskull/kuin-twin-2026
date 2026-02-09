import { IsArray, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

/**
 * DTO para crear un item del portafolio con galería y atributos dinámicos
 */
export class CreatePortfolioItemDto {
  @IsUrl({}, { message: 'URL de imagen principal inválida' })
  imageUrl: string;

  @IsString()
  @MaxLength(1000, { message: 'La descripción no puede exceder los 1000 caracteres' })
  @IsOptional()
  description?: string;

  @IsArray()
  @IsUrl({}, { each: true })
  @IsOptional()
  imageGallery?: string[] = [];

  @IsOptional()
  dynamicAttributes?: any; // JSON
}

export type CreatePortfolioItemInput = CreatePortfolioItemDto;
