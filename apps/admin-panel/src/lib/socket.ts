import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export const getSocket = (userId?: string) => {
  if (!socket && userId) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
    });
    
    console.log('Admin Socket initialized for user:', userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Admin Socket disconnected');
  }
};
