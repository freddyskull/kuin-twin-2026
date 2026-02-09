import { IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentDto {
  @IsUUID('4')
  bookingId: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsNotEmpty()
  processorId: string;

  @IsString()
  @IsNotEmpty()
  status: string;
}

export type CreatePaymentInput = CreatePaymentDto;
