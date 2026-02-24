"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { useMessagesStore } from "@/features/chat/messages.store";
import { getSocket } from "@/lib/socket";

export function SocketListener() {
  const { user } = useAuthStore();
  const { addNotification } = useMessagesStore();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket(user.id);
    if (!socket) return;

    const handleNewMessage = (message: any, isGlobal: boolean) => {
      console.log(`📩 Mensaje recibido en WebStore (${isGlobal ? 'Global' : 'Directo'}):`, message);

      // Notificar si el mensaje es para el usuario actual o es un mensaje global
      if (message.receiverId === user.id || isGlobal) {
        addNotification({ ...message, isGlobal });

        // Sonido de notificación
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => { });
      }
    };

    socket.on("new_message", (msg) => handleNewMessage(msg, false));
    socket.on("admin_new_message", (msg) => handleNewMessage(msg, true));

    return () => {
      socket.off("new_message");
      socket.off("admin_new_message");
    };
  }, [user, addNotification]);

  return null; // Este componente no renderiza nada visual
}
