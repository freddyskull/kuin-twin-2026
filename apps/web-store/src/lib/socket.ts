import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || '';

let socket: Socket | null = null;
let currentUserId: string | null = null;

export const getSocket = (userId?: string) => {
  if (userId && socket && userId !== currentUserId) {
    console.log('🔄 Desconectando socket anterior para nuevo usuario:', userId);
    disconnectSocket();
  }

  if (!socket && userId) {
    currentUserId = userId;
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket', 'polling'],
    });
    
    console.log('✅ Socket inicializado para el usuario:', userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentUserId = null;
    console.log('🛑 Socket desconectado');
  }
};
