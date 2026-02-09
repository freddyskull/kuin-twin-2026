import { IsBoolean, IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { SlotStatus } from '@prisma/client';

export class CreateSlotDto {
  @IsUUID('4', { message: 'ID de servicio inválido' })
  serviceId: string;

  @IsDateString({}, { message: 'Formato de fecha de inicio inválido' })
  startTime: string;

  @IsDateString({}, { message: 'Formato de fecha de fin inválido' })
  endTime: string;

  @IsEnum(SlotStatus)
  @IsOptional()
  status?: SlotStatus = SlotStatus.AVAILABLE;

  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean = false;
}

export type CreateSlotInput = CreateSlotDto;

export class UpdateSlotDto extends PartialType(CreateSlotDto) {}
