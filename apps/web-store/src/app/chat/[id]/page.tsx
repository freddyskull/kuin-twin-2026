"use client";

import { useAuthStore } from "@/features/auth/auth.store";
import { ChatBox, ConversationList } from "@/features/chat/components";
import { ArrowLeft, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Navbar } from "@/components/navbar";

export default function IndividualChatPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const otherUserId = params.id as string;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
        <h2 className="text-xl font-bold mb-2">Inicia sesión para chatear</h2>
        <Link href="/">
          <Button variant="outline" className="rounded-full">Volver al inicio</Button>
        </Link>
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
        <div className="flex items-center gap-4 mb-6 md:mb-8">
          <Link href="/chat">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Chat</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
          {/* Sidebar: Lista de conversaciones (hidden on mobile when in chat) */}
          <div className="hidden lg:flex lg:flex-col lg:col-span-1 bg-card/30 backdrop-blur-md rounded-2xl border border-border/50 p-4 overflow-hidden shadow-xl">
            <h3 className="text-xs font-bold text-muted-foreground mb-4 px-2 uppercase tracking-widest">Mis Chats</h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <ConversationList
                userId={user.id}
                selectedUserId={otherUserId}
                onSelect={(id) => router.push(`/chat/${id}`)}
              />
            </div>
          </div>

          {/* Content: Área de chat activa */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <ChatBox userId={user.id} otherUserId={otherUserId} />
          </div>
        </div>
      </div>
    </div>
  );
}
