import { create } from 'zustand';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; email: string; profile?: { displayName: string; avatarUrl?: string } };
  receiver: { id: string; email: string; profile?: { displayName: string; avatarUrl?: string } };
}

interface MessagesState {
  messages: Message[];
  notificationMessages: Message[];
  isLoading: boolean;
  unreadCount: number;
  error: string | null;
  fetchAllMessages: () => Promise<void>;
  addMessage: (message: Message, isNotification?: boolean) => void;
  removeNotification: (id: string) => void;
  removeNotificationsBySender: (senderId: string) => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
  deleteUserMessages: (userId: string) => void;
  incrementUnread: () => void;
  clearUnread: () => void;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: [],
  notificationMessages: [],
  isLoading: false,
  unreadCount: 0,
  error: null,
  incrementUnread: () => set((state) => ({ unreadCount: state.notificationMessages.length })),
  clearUnread: () => set({ unreadCount: 0, notificationMessages: [] }),
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
  fetchAllMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/chat/admin/all-messages`);
      set({ messages: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addMessage: (message: Message, isNotification = false) => {
    set((state) => {
      const exists = state.messages.some((m) => m.id === message.id);
      if (exists) return state;

      let newNotifications = state.notificationMessages;
      if (isNotification) {
        // Filtrar cualquier notificación previa del mismo emisor para mostrar solo la última
        const filtered = state.notificationMessages.filter(m => m.senderId !== message.senderId);
        newNotifications = [message, ...filtered].slice(0, 5); // Mantener máximo 5 conversaciones recientes
      }

      return {
        messages: [message, ...state.messages],
        notificationMessages: newNotifications,
        unreadCount: isNotification ? newNotifications.length : state.unreadCount
      };
    });
  },
  deleteUserMessages: (userId: string) => {
    set((state) => ({
      messages: state.messages.filter(m => m.senderId !== userId && m.receiverId !== userId)
    }));
  },
  sendMessage: async (senderId: string, receiverId: string, content: string) => {
    try {
      const response = await axios.post(`${API_URL}/chat/send/${senderId}`, { receiverId, content }, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const newMessage = response.data;
      // Use get() to access the current state's actions if needed, but here we can just call set or rely on the socket.
      // Better yet, just call the local addMessage which now has the duplicate check.
      // But we are inside `create`, `get` is available if we passed it. 
      // Zustand `create` is `(set, get)`. The current file has `create<MessagesState>((set) => ({`.
      // It doesn't use `get`.
      
      // I will just use `set` with the same duplicate logic to be safe and avoiding changing the function signature potentially.
      set((state) => {
         if (state.messages.some((m) => m.id === newMessage.id)) {
           return state;
         }
         return { messages: [newMessage, ...state.messages] };
      });
    } catch (error: any) {
      console.error('Failed to send message', error);
      throw error;
    }
  }
}));
