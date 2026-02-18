"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/features/auth/auth.store";
import { Loader2, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/components/ui";

function NewChatContent() {
  const { user, setAuth } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get('vendorId');
  const [isReady, setIsReady] = useState(false);

  // Handle rehydration
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady && user && vendorId) {
      router.replace(`/chat/${vendorId}`);
    }
  }, [isReady, user, vendorId, router]);

  const handleDemoLogin = () => {
    // Dummy vendor to talk to
    const demoUser = {
      id: "550e8400-e29b-41d4-a716-446655440000", // Fix a UUID for demo
      email: "demo@kuin-twin.com",
      role: 'CUSTOMER' as const,
      displayName: "Comprador Demo"
    };
    setAuth(demoUser, "fake-jwt-token");
  };

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-background">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <LogIn className="w-10 h-10 text-primary opacity-40" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Inicia sesión para chatear</h2>
        <p className="text-muted-foreground max-w-sm mb-8">
          Para contactar con los vendedores y solicitar cotizaciones, necesitas tener una cuenta.
        </p>

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button onClick={handleDemoLogin} className="rounded-full shadow-lg shadow-primary/20 gap-2 h-12">
            <UserPlus className="w-5 h-5" />
            Entrar como Invitado (Demo)
          </Button>
          <Button variant="outline" onClick={() => router.push('/')} className="rounded-full h-12">
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
        <p className="text-lg font-medium text-foreground">Iniciando conversación...</p>
        <p className="text-xs text-muted-foreground mt-2">Estamos conectándote con el experto</p>
      </div>
    </div>
  );
}

export default function NewChatPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
      </div>
    }>
      <NewChatContent />
    </Suspense>
  );
}
