import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);
  
  // Track connected users: userId -> socketId
  private connectedUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.connectedUsers.set(userId, client.id);
      this.logger.log(`Client connected: ${userId} (${client.id})`);
      
      // Notify others that this user is online
      this.broadcast('user_status_changed', { userId, status: 'online' });
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.connectedUsers.delete(userId);
        this.logger.log(`Client disconnected: ${userId}`);
        
        // Notify others that this user is offline
        this.broadcast('user_status_changed', { userId, status: 'offline' });
        break;
      }
    }
  }

  /**
   * Verificar si un usuario está en línea
   */
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  /**
   * Obtener todos los IDs de usuarios conectados
   */
  getConnectedUserIds(): string[] {
    return Array.from(this.connectedUsers.keys());
  }

  /**
   * Enviar notificación a un usuario específico
   */
  sendToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  /**
   * Emitir evento a todos los conectados
   */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }
}
