"use client";

import { useOnlineStatus } from "../chat.hooks";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  userId: string;
  showText?: boolean;
}

export const StatusIndicator = ({ userId, showText = false }: StatusIndicatorProps) => {
  const { data: status, isLoading } = useOnlineStatus(userId);

  if (isLoading) return null;

  const isOnline = status?.isOnline || false;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "h-2.5 w-2.5 rounded-full ring-2 ring-background",
          isOnline
            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
            : "bg-gray-400"
        )}
      />
      {showText && (
        <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
          {isOnline ? "En línea" : "Desconectado"}
        </span>
      )}
    </div>
  );
};
