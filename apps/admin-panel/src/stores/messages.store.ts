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
  sender: { email: string; profile?: { displayName: string; avatarUrl?: string } };
  receiver: { email: string; profile?: { displayName: string; avatarUrl?: string } };
}

interface MessagesState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  fetchAllMessages: () => Promise<void>;
  addMessage: (message: Message) => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => Promise<void>;
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  fetchAllMessages: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/chat/admin/all-messages`);
      set({ messages: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [message, ...state.messages],
    }));
  },
  sendMessage: async (senderId: string, receiverId: string, content: string) => {
    try {
      const response = await axios.post(`${API_URL}/chat/send/${senderId}`, { receiverId, content }, {
         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      // The socket usually catches the new message, but we can optimistically add it or wait for socket
      // For now let's rely on the socket 'admin_new_message' or 'new_message' event which we listen to
      // or we can manually add it if the socket event doesn't fire for the sender (it usually doesn't)
      const newMessage = response.data;
      set((state) => ({
        messages: [newMessage, ...state.messages]
      }));
    } catch (error: any) {
      console.error('Failed to send message', error);
      throw error;
    }
  }
}));
