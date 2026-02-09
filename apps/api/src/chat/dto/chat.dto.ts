import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  receiverId: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  content: string;
}

export type SendMessageInput = SendMessageDto;
