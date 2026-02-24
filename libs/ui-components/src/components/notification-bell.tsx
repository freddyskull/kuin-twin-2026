"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, X, MessageSquare, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

export interface NotificationMessage {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  createdAt: string;
  isRead?: boolean;
  sender: {
    displayName?: string;
    email: string;
    avatarUrl?: string;
    profile?: {
      displayName: string;
      avatarUrl?: string;
    };
  };
}

export interface NotificationBellProps {
  unreadCount: number;
  notifications: NotificationMessage[];
  onClearAll: () => void;
  onRemoveNotification: (id: string) => void;
  onViewAll: () => void;
  onNotificationClick: (msg: NotificationMessage) => void;
  className?: string;
  dropdownClassName?: string;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  unreadCount,
  notifications,
  onClearAll,
  onRemoveNotification,
  onViewAll,
  onNotificationClick,
  className,
  dropdownClassName,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("es-ES", { day: "2-digit", month: "short" }),
      time: date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    };
  };

  return (
    <div className={cn("relative", className)} ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={cn(
          "relative p-2 rounded-xl border transition-all group focus:outline-none",
          showNotifications
            ? "bg-primary/20 border-primary/50 text-primary shadow-lg shadow-primary/20"
            : "bg-background border-border text-slate-400 hover:text-foreground hover:bg-accent/50"
        )}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-primary rounded-full border-2 border-background animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={cn(
              "absolute right-0 mt-4 bg-popover text-popover-foreground backdrop-blur-3xl border border-border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 overflow-hidden",
              dropdownClassName || "w-[320px] sm:w-[400px]"
            )}
          >
            <div className="px-7 py-7 border-b border-border flex items-center justify-between bg-accent/30">
              <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em]">Notificaciones</h3>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onClearAll();
                      setShowNotifications(false);
                    }}
                    className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
                  >
                    Borrar
                  </button>
                )}
                <button
                  onClick={() => setShowNotifications(false)}
                  className="hover:rotate-90 transition-transform duration-300"
                >
                  <X className="h-4 w-4 text-slate-500 hover:text-white transition-colors" />
                </button>
              </div>
            </div>

            <div className="max-h-[460px] overflow-y-auto custom-scrollbar">
              {notifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {notifications.map((msg) => {
                    const { date, time } = formatMessageDate(msg.createdAt);
                    const displayName = msg.sender.profile?.displayName || msg.sender.displayName || msg.sender.email;
                    const avatarUrl = msg.sender.profile?.avatarUrl || msg.sender.avatarUrl;

                    return (
                      <div
                        key={msg.id}
                        onClick={() => {
                          onNotificationClick(msg);
                          setShowNotifications(false);
                        }}
                        className="px-6 py-5 hover:bg-accent transition-all cursor-pointer group flex gap-4 border-b border-border/50 last:border-0"
                      >
                        <div className="h-12 w-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 group-hover:bg-primary/30 group-hover:scale-110 transition-all overflow-hidden shadow-xl shadow-primary/5">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1.5 pt-0.5 relative pr-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveNotification(msg.id);
                            }}
                            className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-black text-foreground truncate group-hover:text-primary transition-colors">
                              {displayName}
                            </span>
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                              {date}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <Clock className="h-3 w-3" />
                            {time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-5">
                  <div className="h-16 w-16 rounded-[2rem] bg-accent/30 flex items-center justify-center border border-border text-slate-400 shadow-inner">
                    <Bell className="h-7 w-7 opacity-20" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-black text-slate-500 uppercase tracking-[0.15em]">Bandeja Vacía</p>
                    <p className="text-[11px] text-muted-foreground font-medium max-w-[220px]">No hay nuevos mensajes para mostrar en este momento</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                onViewAll();
                setShowNotifications(false);
              }}
              className="w-full py-7 px-7 text-center bg-accent/20 border-t border-border text-[10px] font-black text-muted-foreground hover:text-primary hover:bg-accent/40 transition-all uppercase tracking-[0.25em]"
            >
              Ver todos los mensajes
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
