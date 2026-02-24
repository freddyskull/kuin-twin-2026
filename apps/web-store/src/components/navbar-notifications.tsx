"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, Bell, X, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMessagesStore } from "@/features/chat";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NavbarNotifications() {
  const { unreadCount, notificationMessages, removeNotification, clearUnread } = useMessagesStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
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
    <div className="relative" ref={notificationRef}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={cn(
          "relative p-2 rounded-xl border transition-all group",
          showNotifications
            ? "bg-primary/10 border-primary/50 text-primary"
            : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <MessageSquare className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-primary rounded-full border-2 border-background animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 bg-popover/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Mensajes</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => clearUnread()}
                    className="text-[10px] font-bold text-primary hover:underline uppercase"
                  >
                    Borrar
                  </button>
                )}
                <button onClick={() => setShowNotifications(false)}>
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </button>
              </div>
            </div>

            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {notificationMessages.length > 0 ? (
                <div className="divide-y divide-border">
                  {notificationMessages.map((msg) => {
                    const { date, time } = formatMessageDate(msg.createdAt);
                    // Atento a la estructura del DTO que recibimos por socket
                    const displayName = msg.sender.displayName || msg.sender.profile?.displayName || msg.sender.email;
                    const avatarUrl = msg.sender.avatarUrl || msg.sender.profile?.avatarUrl;

                    return (
                      <Link
                        key={msg.id}
                        href={`/chat/${msg.senderId}`}
                        onClick={() => {
                          removeNotification(msg.id);
                          setShowNotifications(false);
                        }}
                        className="p-4 hover:bg-muted/50 transition-colors flex gap-3 group"
                      >
                        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:border-primary/50 transition-all overflow-hidden">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-primary">{displayName.substring(0, 2).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-foreground truncate">{displayName}</span>
                            <span className="text-[9px] font-medium text-muted-foreground">{date}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed italic">
                            "{msg.content}"
                          </p>
                          <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/60">
                            <Clock className="h-3 w-3" />
                            {time}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-2xl bg-muted/50 flex items-center justify-center border border-border">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Bandeja de entrada limpia</p>
                </div>
              )}
            </div>

            <Link
              href="/chat"
              onClick={() => setShowNotifications(false)}
              className="block p-3 text-center bg-muted/30 border-t border-border text-[10px] font-bold text-primary hover:bg-muted/50 transition-all uppercase tracking-widest"
            >
              Ver todos los mensajes
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
