import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send/:senderId')
  async sendMessage(
    @Param('senderId') senderId: string,
    @Body() dto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(senderId, dto);
  }

  @Get('messages/:userId/:otherUserId')
  async getMessages(
    @Param('userId') userId: string,
    @Param('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getMessages(userId, otherUserId);
  }

  @Get('conversations/:userId')
  async getConversations(@Param('userId') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Patch('read/:userId/:senderId')
  async markAsRead(
    @Param('userId') userId: string,
    @Param('senderId') senderId: string,
  ) {
    return this.chatService.markAsRead(userId, senderId);
  }
}
