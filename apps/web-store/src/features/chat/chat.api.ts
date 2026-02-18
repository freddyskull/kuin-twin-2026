import { api } from '@/lib/api';
import { MessageDto, SendMessageDto } from 'shared-types';

export const getMessages = async (userId: string, otherUserId: string): Promise<MessageDto[]> => {
  const { data } = await api.get<MessageDto[]>(`/chat/messages/${userId}/${otherUserId}`);
  return data;
};

export const getConversations = async (userId: string): Promise<any[]> => {
  const { data } = await api.get<any[]>(`/chat/conversations/${userId}`);
  return data;
};

export const sendMessage = async (senderId: string, input: SendMessageDto): Promise<MessageDto> => {
  const { data } = await api.post<MessageDto>(`/chat/send/${senderId}`, input);
  return data;
};

export const markAsRead = async (userId: string, senderId: string): Promise<{ success: true }> => {
  const { data } = await api.patch<{ success: true }>(`/chat/read/${userId}/${senderId}`);
  return data;
};
