import { create } from 'zustand';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender: { 
    id: string; 
    email: string; 
    displayName?: string;
    avatarUrl?: string;
    profile?: { displayName: string; avatarUrl?: string };
  };
  isGlobal?: boolean;
}

interface MessagesState {
  notificationMessages: Message[];
  unreadCount: number;
  addNotification: (message: Message) => void;
  removeNotification: (id: string) => void;
  removeNotificationsBySender: (senderId: string) => void;
  clearUnread: () => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  notificationMessages: [],
  unreadCount: 0,
  addNotification: (message: Message) => {
    set((state) => {
      // Evitar duplicados
      const exists = state.notificationMessages.some((m) => m.id === message.id);
      if (exists) return state;

      // Filtrar notificaciones previas del mismo emisor para mostrar solo la última
      const filtered = state.notificationMessages.filter(m => m.senderId !== message.senderId);
      const newNotifications = [message, ...filtered].slice(0, 5); // Máximo 5 recientes

      return {
        notificationMessages: newNotifications,
        unreadCount: newNotifications.length
      };
    });
  },
  removeNotification: (id: string) => set((state) => {
    const updatedNotifications = state.notificationMessages.filter(m => m.id !== id);
    return {
      notificationMessages: updatedNotifications,
      unreadCount: updatedNotifications.length
    };
  }),
  removeNotificationsBySender: (senderId: string) => set((state) => {
    const updatedNotifications = state.notificationMessages.filter(m => m.senderId !== senderId);
    return {
      notificationMessages: updatedNotifications,
      unreadCount: updatedNotifications.length
    };
  }),
  clearUnread: () => set({ unreadCount: 0, notificationMessages: [] }),
}));
