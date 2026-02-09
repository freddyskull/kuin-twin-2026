import { IsString, MinLength } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateServiceUnitDto {
  @IsString()
  @MinLength(1, { message: 'el nombre es requerido' })
  name: string;

  @IsString()
  @MinLength(1, { message: 'la abreviación es requerida' })
  abbreviation: string;
}

export type CreateServiceUnitInput = CreateServiceUnitDto;

export class UpdateServiceUnitDto extends PartialType(CreateServiceUnitDto) {}
