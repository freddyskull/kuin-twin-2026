import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/chat.dto';

@Controller('chat')
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

  @Get('admin/all-messages')
  async getAdminMessages(
    @Query('limit') limit?: string,
    @Query('skip') skip?: string,
  ) {
    return this.chatService.getAdminAllMessages(
      limit ? parseInt(limit) : 100,
      skip ? parseInt(skip) : 0
    );
  }

  @Get('status/:userId')
  async getOnlineStatus(@Param('userId') userId: string) {
    return this.chatService.getOnlineStatus(userId);
  }
}
