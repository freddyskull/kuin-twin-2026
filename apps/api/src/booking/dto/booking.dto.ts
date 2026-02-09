import { IsArray, IsDateString, IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { BookingStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsUUID('4', { message: 'ID de cliente inválido' })
  customerId: string;

  @IsUUID('4', { message: 'ID de servicio inválido' })
  serviceId: string;

  @IsDateString({}, { message: 'Fecha programada inválida' })
  scheduledDate: string;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  slotIds?: string[];

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  quantity?: number = 1;
}

export type CreateBookingInput = CreateBookingDto;

export class UpdateBookingDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}
