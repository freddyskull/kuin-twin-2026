"use client";

import { useState, useRef, useEffect } from 'react';
import { useChatMessages, useSendMessage, useMarkAsRead, useMessagesStore } from '../chat.hooks';
import { ChatMessage } from './chat-message';
import { Button, Input } from '@/components/ui';
import { Send, Loader2 } from 'lucide-react';

interface ChatBoxProps {
  userId: string;
  otherUserId: string;
}

export const ChatBox = ({ userId, otherUserId }: ChatBoxProps) => {
  const [content, setContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useChatMessages(userId, otherUserId);
  const sendMessageMutation = useSendMessage(userId);
  const markAsReadMutation = useMarkAsRead(userId);
  const { removeNotificationsBySender } = useMessagesStore();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark as read when messages load
  useEffect(() => {
    if (messages && messages.length > 0) {
      const hasUnread = messages.some(m => !m.isRead && m.receiverId === userId);
      if (hasUnread) {
        markAsReadMutation.mutate(otherUserId);
        removeNotificationsBySender(otherUserId);
      }
    }
  }, [messages, userId, otherUserId, removeNotificationsBySender]);

  const handleSend = () => {
    if (!content.trim()) return;
    sendMessageMutation.mutate({
      receiverId: otherUserId,
      content,
    }, {
      onSuccess: () => setContent('')
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[600px] border border-border/50 rounded-2xl overflow-hidden bg-card/30 backdrop-blur-md shadow-xl">
      {/* Header (Optional, could be elsewhere) */}

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar"
      >
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary opacity-50" />
          </div>
        ) : (!messages || messages.length === 0) ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
            <p className="text-sm">Envía un mensaje para comenzar la conversación.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isMe={msg.senderId === userId}
            />
          ))
        )}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe un mensaje..."
            className="rounded-full bg-background border-border/50 focus-visible:ring-primary shadow-inner"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full h-10 w-10 shrink-0 animate-in fade-in"
            disabled={!content.trim() || sendMessageMutation.isPending}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
