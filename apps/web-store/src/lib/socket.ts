import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || '';

let socket: Socket | null = null;

export const getSocket = (userId?: string) => {
  if (!socket && userId) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ['websocket'],
    });
    
    console.log('Socket initialized for user:', userId);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Socket disconnected');
  }
};
