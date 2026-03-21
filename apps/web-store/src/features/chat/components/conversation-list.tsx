"use client";

import { useConversations } from '../chat.hooks';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { Loader2 } from 'lucide-react';
import { StatusIndicator } from './status-indicator';

interface ConversationListProps {
  userId: string;
  selectedUserId?: string;
  onSelect: (otherUserId: string) => void;
}

export const ConversationList = ({ userId, selectedUserId, onSelect }: ConversationListProps) => {
  const { data: conversations, isLoading } = useConversations(userId);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary opacity-50" />
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground opacity-50">
        <p className="text-sm">No tienes conversaciones activas.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 overflow-y-auto max-h-full">
      {conversations.map((conv) => {
        const otherUser = conv.user;
        const lastMsg = conv.lastMessage;
        const isSelected = otherUser.id === selectedUserId;
        const unreadCount = 0; // The backend doesn't return count yet, could be added later

        return (
          <button
            key={otherUser.id}
            onClick={() => onSelect(otherUser.id)}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl transition-all text-left",
              isSelected
                ? "bg-primary/10 border border-primary/20"
                : "hover:bg-muted/50 border border-transparent"
            )}
          >
            <Avatar className="h-12 w-12 border border-border/50 overflow-hidden">
              {otherUser.profile?.avatarUrl ? (
                <AvatarImage src={otherUser.profile?.avatarUrl} alt={otherUser.profile?.displayName || otherUser.email} />
              ) : (
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold w-full h-full flex items-center justify-center">
                  {(otherUser.profile?.displayName || otherUser.email).substring(0, 2).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline gap-2">
                <div className="flex items-center gap-2 truncate">
                  <h4 className={cn("font-bold text-sm truncate", !isSelected && "group-hover:text-primary transition-colors")}>
                    {otherUser.profile?.displayName || otherUser.email}
                  </h4>
                  <StatusIndicator userId={otherUser.id} />
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(lastMsg.createdAt).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className={cn(
                "text-xs truncate",
                lastMsg.receiverId === userId && !lastMsg.isRead
                  ? "text-foreground font-bold"
                  : "text-muted-foreground"
              )}>
                {lastMsg.senderId === userId ? "Tú: " : ""}{lastMsg.content}
              </p>
            </div>

            {lastMsg.receiverId === userId && !lastMsg.isRead && (
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_0_rgba(var(--primary),0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
