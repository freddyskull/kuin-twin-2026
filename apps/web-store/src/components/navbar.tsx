"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { Button } from '@/components/ui';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavbarProps {
  className?: string;
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ className, transparent = false }) => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isChat = pathname?.startsWith("/chat");

  return (
    <nav className={cn(
      "sticky top-0 z-50 h-20 backdrop-blur-md border-b border-border/40",
      transparent ? "bg-transparent border-none absolute w-full" : "bg-background/80",
      className
    )}>
      <div className="container-app h-full flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
          KUIN<span className="text-foreground">TWIN</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="/"
            className={cn("hover:text-primary transition-colors font-bold", isHome ? "text-foreground" : "text-muted-foreground")}
          >
            Inicio
          </Link>
          <Link
            href="/chat"
            className={cn("hover:text-primary transition-colors font-bold", isChat ? "text-foreground" : "text-muted-foreground")}
          >
            Mensajes
          </Link>
          <Link href="#" className="hover:text-primary transition-colors font-bold">Explorar</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground line-clamp-1">{user.displayName || user.email}</p>
                <button
                  onClick={logout}
                  className="text-[10px] text-muted-foreground hover:text-destructive transition-colors uppercase tracking-widest font-black"
                >
                  Cerrar Sesión
                </button>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/20 ring-2 ring-primary/5">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold font-mono">
                  {(user.displayName || user.email).substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="hidden sm:inline-flex rounded-full">Iniciar Sesión</Button>
              </Link>
              <Link href="/registro">
                <Button className="rounded-full px-6 shadow-lg shadow-primary/20">Empezar</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
