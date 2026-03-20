"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/features/auth/auth.store";
import { useMessagesStore } from "@/features/chat/messages.store";
import { getSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";

export function SocketListener() {
  const { user } = useAuthStore();
  const { addNotification } = useMessagesStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const socket = getSocket(user.id);
    if (!socket) return;

    const handleNewMessage = (message: any, isGlobal: boolean) => {
      // Protección extra si el usuario se vuelve null durante la ejecución
      if (!user) return;

      console.log(`📩 Mensaje recibido en WebStore (${isGlobal ? 'Global' : 'Directo'}):`, message);

      // Invalidad consultas globales de chat
      queryClient.invalidateQueries({ queryKey: ['chat', 'conversations', user.id] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', user.id] });

      // Notificar si el mensaje es para el usuario actual o es un mensaje global
      if (message.receiverId === user.id || isGlobal) {
        addNotification({ ...message, isGlobal });

        // Sonido de notificación
        try {
          const audio = new Audio("/sounds/notification.mp3");
          audio.play().catch(() => { });
        } catch (e) {
          console.warn('No se pudo reproducir el sonido de notificación');
        }
      }
    };

    socket.on("new_message", (msg) => handleNewMessage(msg, false));
    socket.on("admin_new_message", (msg) => handleNewMessage(msg, true));

    return () => {
      socket.off("new_message");
      socket.off("admin_new_message");
    };
  }, [user, addNotification, queryClient]);

  return null; // Este componente no renderiza nada visual
}
