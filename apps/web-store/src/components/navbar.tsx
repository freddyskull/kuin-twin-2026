"use client";

import React from "react";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/auth.store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "ui-components";
import { useMessagesStore } from "@/features/chat";
import { useRouter } from "next/navigation";

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = pathname === "/";
  const isChat = pathname?.startsWith("/chat");

  return (
    <>
      <div>
        <div className="h-20"></div>
        <nav className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "h-16 bg-background/80 backdrop-blur-md border-b border-border/40"
            : "h-20 bg-transparent border-transparent",
          className
        )}>
          <div className="container-app h-full flex items-center justify-between relative">
            <Link href="/" className="text-2xl font-bold tracking-tighter text-primary">
              KUIN<span className="text-foreground">TWIN</span>
            </Link>

            {/* Links centrados absolutamente respecto a la pantalla */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className={cn("hover:text-primary transition-colors font-bold", isHome ? "text-foreground" : "text-muted-foreground")}
              >
                Inicio
              </Link>
              <Link href="/planes" className={cn("hover:text-primary transition-colors font-bold", pathname === "/planes" ? "text-foreground" : "text-muted-foreground")}>Planes</Link>
              <Link href="#" className="hover:text-primary transition-colors font-bold">Explorar</Link>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {user && (
                <NotificationBell
                  unreadCount={useMessagesStore.getState().unreadCount}
                  notifications={useMessagesStore((state) => state.notificationMessages)}
                  onClearAll={() => useMessagesStore.getState().clearUnread()}
                  onRemoveNotification={(id) => useMessagesStore.getState().removeNotification(id)}
                  onViewAll={() => router.push("/chat")}
                  onNotificationClick={(msg) => router.push(`/chat/${msg.senderId}`)}
                  dropdownClassName="w-[min(90vw,360px)]"
                />
              )}
              <ThemeToggle />
              <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />
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
      </div>
    </>
  );
};
