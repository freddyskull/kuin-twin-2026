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

    // Escuchar nuevos mensajes
    socket.on("new_message", (message) => {
      // Solo notificar si el mensaje es para el usuario actual
      if (message.receiverId === user.id) {
        addNotification(message);

        // Opcional: Sonido de notificación
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => { }); // Ignorar errores de autoplay
      }
    });

    return () => {
      socket.off("new_message");
    };
  }, [user, addNotification]);

  return null; // Este componente no renderiza nada visual
}
