import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SocketGateway } from '../socket/socket.gateway';
import { SendMessageInput } from './dto/chat.dto';
import { Message, Prisma } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway,
  ) {}

  /**
   * Enviar un mensaje y notificar por WebSocket
   */
  async sendMessage(senderId: string, input: SendMessageInput): Promise<Message> {
    const { receiverId, content } = input;

    // 1. Validar receptor
    const receiver = await this.prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) throw new NotFoundException('Receptor no encontrado');

    // 2. Guardar en DB
    const message = await this.prisma.message.create({
      data: {
        content,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
      } as Prisma.MessageCreateInput,
      include: {
        sender: {
          select: { id: true, email: true, profile: { select: { displayName: true, avatarUrl: true } } },
        },
        receiver: {
          select: { id: true, email: true, profile: { select: { displayName: true, avatarUrl: true } } },
        },
      },
    });

    // 3. Notificar vía WebSocket en tiempo real
    this.socketGateway.sendToUser(receiverId, 'new_message', message);
    
    // 4. Notificar a administradores (broadcast global para monitoreo)
    this.socketGateway.broadcast('admin_new_message', message);

    return message as Message;
  }

  /**
   * Obtener historial de chat entre dos usuarios
   */
  async getMessages(userId: string, otherUserId: string): Promise<Message[]> {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Obtener lista de conversaciones (últimos mensajes)
   */
  async getConversations(userId: string) {
    // Esta es una query más compleja para obtener usuarios con los que se ha hablado
    // Por simplicidad, devolvemos los mensajes agrupados por el "otro" usuario
    const messages = await this.prisma.message.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, email: true, profile: true } },
        receiver: { select: { id: true, email: true, profile: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Lógica para agrupar por usuario único
    const conversations = new Map();
    messages.forEach(msg => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversations.has(otherUser.id)) {
        conversations.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg,
        });
      }
    });

    return Array.from(conversations.values());
  }

  /**
   * Obtener todos los mensajes del sistema (Solo para Admin)
   */
  async getAdminAllMessages(limit: number = 100, skip: number = 0) {
    return this.prisma.message.findMany({
      include: {
        sender: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
        receiver: { select: { id: true, email: true, profile: { select: { displayName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: skip,
    });
  }

  /**
   * Verificar si un usuario está en línea
   */
  getOnlineStatus(userId: string) {
    return {
      userId,
      isOnline: this.socketGateway.isUserOnline(userId),
    };
  }

  /**
   * Marcar mensajes como leídos
   */
  async markAsRead(userId: string, senderId: string) {
    await this.prisma.message.updateMany({
      where: {
        senderId,
        receiverId: userId,
        isRead: false,
      },
      data: { isRead: true },
    });
    return { success: true };
  }
}
