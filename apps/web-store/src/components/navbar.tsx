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
import { LayoutDashboard, LogOut, User as UserIcon, Settings, Sparkles } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  className?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ className }) => {
  const { user, logout } = useAuthStore();
  const { unreadCount, notificationMessages, clearUnread, removeNotification } = useMessagesStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isHome = pathname === "/";
  const isChat = pathname?.startsWith("/chat");

  // Render user section only after mounting to avoid hydration mismatch
  const renderUserSection = () => {
    if (!isMounted) return null;

    if (user) {
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer outline-none group/user">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-foreground line-clamp-1">{user.displayName || user.email}</p>
                <p className="text-[9px] text-primary font-black uppercase tracking-widest opacity-70">
                  {user.role === 'ADMIN' ? 'Administrador' : user.role === 'VENDOR' ? 'Proveedor' : 'Cliente'}
                </p>
              </div>
              <Avatar className="h-10 w-10 border-2 border-primary/20 ring-4 ring-primary/5 transition-all group-hover/user:ring-primary/10 shadow-lg group-data-[state=open]/user:ring-primary/20">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold font-mono">
                  {(user.displayName || user.email).substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent className="w-64 glass-card bg-card/90 border border-border/50 rounded-2xl shadow-2xl p-2 backdrop-blur-xl" align="end" sideOffset={12}>
            <DropdownMenuLabel className="px-4 py-3 border-b border-border/10 mb-2 font-normal">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3 h-3 text-primary" />
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Cuenta KuinTwin</p>
              </div>
              <p className="text-xs font-bold truncate text-foreground">{user.email}</p>
            </DropdownMenuLabel>
            
            <DropdownMenuGroup className="space-y-1">
              {(user.role === 'ADMIN' || user.role === 'VENDOR') && (
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-primary focus:bg-primary/10 transition-all cursor-pointer">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-wider">Panel Administrativo</span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/70 focus:text-foreground transition-all cursor-pointer">
                <UserIcon className="w-4 h-4" />
                <span className="text-xs font-bold">Mi Perfil</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-foreground/70 focus:text-foreground transition-all cursor-pointer">
                <Settings className="w-4 h-4" />
                <span className="text-xs font-bold">Configuración</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-border/10 my-2 mx-2" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground focus:text-destructive focus:bg-destructive/10 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <>
        <Link href="/login">
          <Button variant="ghost" className="hidden sm:inline-flex rounded-full">Iniciar Sesión</Button>
        </Link>
        <Link href="/registro">
          <Button className="rounded-full px-6 shadow-lg shadow-primary/20">Empezar</Button>
        </Link>
      </>
    );
  };

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
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              {isMounted && user && (
                <NotificationBell
                  unreadCount={unreadCount}
                  notifications={notificationMessages}
                  onClearAll={clearUnread}
                  onRemoveNotification={removeNotification}
                  onViewAll={() => router.push("/chat")}
                  onNotificationClick={(msg) => router.push(`/chat/${msg.senderId}`)}
                  dropdownClassName="w-[min(90vw,360px)]"
                />
              )}
              <ThemeToggle />
              <div className="h-6 w-px bg-border/40 mx-1 hidden sm:block" />
              {renderUserSection()}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};
