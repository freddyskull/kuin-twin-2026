import React, { useEffect } from 'react';
import { useMessagesStore } from '../stores/messages.store';
import { useAuthStore } from '../stores/auth.store';
import { getSocket, disconnectSocket } from '../lib/socket';
import { useToast } from 'ui-components';

export const SocketListener: React.FC = () => {
  const { addMessage, incrementUnread } = useMessagesStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!user?.id) {
      disconnectSocket();
      return;
    }

    const socket = getSocket(user.id);
    if (!socket) return;

    const handleNewMessage = (payload: any, isGlobal: boolean) => {
      console.log(`📩 [SocketListener] Mensaje recibido (${isGlobal ? 'Global' : 'Directo'}):`, payload);

      // Add to store as notification
      addMessage(payload, true);

      // Increment unread count for the bell
      incrementUnread();

      // Show toast notification
      toast({
        title: isGlobal ? "Actividad del Sistema" : "Nuevo Mensaje",
        description: `${payload.sender?.profile?.displayName || payload.sender?.email}: ${payload.content}`,
        variant: "default",
      });
    };

    // Listen for new messages globally (monitoring) and directly
    socket.on('admin_new_message', (payload) => handleNewMessage(payload, true));
    socket.on('new_message', (payload) => handleNewMessage(payload, false));

    return () => {
      console.log('🧹 Limpiando listeners de socket');
      socket.off('admin_new_message');
      socket.off('new_message');
    };
  }, [user?.id, addMessage, incrementUnread, toast]);

  return null;
};
