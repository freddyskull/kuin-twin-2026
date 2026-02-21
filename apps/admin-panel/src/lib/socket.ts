import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

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
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      timeout: 10000,
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket conectado exitosamente. ID:', socket?.id, 'UserID:', userId);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión de Socket:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('ℹ️ Socket desconectado:', reason);
    });
    
    console.log('🔌 Inicializando socket para usuario:', userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    currentUserId = null;
    console.log('🛑 Socket desconectado y limpiado');
  }
};
