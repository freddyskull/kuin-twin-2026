import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMediaDto {
  @IsUrl({}, { message: 'URL de medio inválida' })
  url: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de archivo es requerido' })
  fileName: string;

  @IsString()
  @IsNotEmpty({ message: 'El tipo MIME es requerido' })
  mimeType: string;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  size: number;

  @IsString()
  @IsOptional()
  alt?: string;
}

export type CreateMediaInput = CreateMediaDto;
