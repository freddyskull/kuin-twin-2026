import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, getConversations, sendMessage, markAsRead } from './chat.api';
import { SendMessageDto } from 'shared-types';
import { api } from '@/lib/api';

export const useChatMessages = (userId: string | undefined, otherUserId: string | undefined) => {
  return useQuery({
    queryKey: ['chat', 'messages', userId, otherUserId],
    queryFn: () => getMessages(userId!, otherUserId!),
    enabled: !!userId && !!otherUserId,
  });
};

export const useConversations = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['chat', 'conversations', userId],
    queryFn: () => getConversations(userId!),
    enabled: !!userId,
  });
};

export const useSendMessage = (senderId: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (input: SendMessageDto) => sendMessage(senderId!, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', senderId, variables.receiverId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', senderId] });
    },
  });
};

export const useMarkAsRead = (userId: string | undefined) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (senderId: string) => markAsRead(userId!, senderId),
    onSuccess: (_, senderId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', userId, senderId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', userId] });
    },
  });
};

export const useOnlineStatus = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user', 'status', userId],
    queryFn: async () => {
      const { data } = await api.get<{ userId: string; isOnline: boolean }>(`/chat/status/${userId}`);
      return data;
    },
    enabled: !!userId,
    refetchInterval: 10000, // Poll every 10s
  });
};
