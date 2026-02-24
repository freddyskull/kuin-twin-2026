"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { ConversationList } from "@/features/chat/components";
import { MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

export default function ChatInboxPage() {
  const { user, setAuth } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
        <MessageSquare className="w-16 h-16 text-primary mb-6 opacity-20" />
        <h2 className="text-2xl font-bold mb-2">Tus mensajes tienen que esperar</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">Inicia sesión para ver tus conversaciones activas.</p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Link href="/login">
            <Button className="rounded-full w-full h-12 gap-2 shadow-lg shadow-primary/20">
              Iniciar Sesión
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="rounded-full w-full h-12">Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <div className="relative z-10 flex flex-col h-screen pt-32 container-app p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Mensajes</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden pb-8">
          {/* Sidebar: Lista de conversaciones */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50 p-4 flex flex-col overflow-hidden shadow-xl"
          >
            <h3 className="text-xs font-bold text-muted-foreground mb-4 px-2 uppercase tracking-widest">Conversaciones Recientes</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ConversationList
                userId={user.id}
                onSelect={(id) => router.push(`/chat/${id}`)}
              />
            </div>
          </motion.div>

          {/* Content: Área de chat vacía */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden lg:flex lg:col-span-2 bg-muted/20 border border-dashed border-border/50 rounded-2xl items-center justify-center flex-col text-center p-12"
          >
            <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <MessageSquare className="w-10 h-10 text-primary opacity-40" />
            </div>
            <h3 className="text-lg font-bold mb-2">Tus conversaciones</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Selecciona un chat de la lista para ver los mensajes. Puedes contactar a un vendedor desde la página de su servicio.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
