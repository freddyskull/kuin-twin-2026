import { cn } from "@/lib/utils";
import { MessageDto } from "shared-types";

interface ChatMessageProps {
  message: MessageDto;
  isMe: boolean;
}

export const ChatMessage = ({ message, isMe }: ChatMessageProps) => {
  const time = new Date(message.createdAt).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn("flex w-full mb-4", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-sm",
          isMe
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted text-foreground rounded-tl-none border border-border/50"
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
        <div className={cn("text-[10px] mt-1 opacity-70 flex justify-end items-center gap-1")}>
          {time}
          {isMe && (
            <span className={cn(message.isRead ? "text-blue-400" : "text-white/50")}>
              {message.isRead ? "✓✓" : "✓"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
