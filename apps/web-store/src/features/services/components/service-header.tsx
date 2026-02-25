'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/features/auth/auth.store';

interface ServiceHeaderProps {
  serviceId: string;
  vendorId: string;
  title: string;
  description?: string;
}

export const ServiceHeader: React.FC<ServiceHeaderProps> = ({ serviceId, vendorId, title, description }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Verificar si es favorito al cargar
    const checkFavorite = async () => {
      try {
        const { data } = await api.get(`/favorites/${serviceId}/check`);
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };
    if (serviceId && token) checkFavorite();
  }, [serviceId, token]);

  const handleShare = async () => {
    setIsSharing(true);
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: window.location.href,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing', err);
        }
      }
    } else {
      // Fallback
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Podríamos usar un toast aquí si lo tuviéramos configurado
        alert('¡Enlace copiado al portapapeles!');
      } catch (err) {
        console.error('Error copying to clipboard', err);
      }
    }
    setTimeout(() => setIsSharing(false), 1000);
  };

  const toggleFavorite = async () => {
    if (!token) {
      router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      // Toggle optimista
      setIsFavorite(!isFavorite);
      const { data } = await api.post(`/favorites/${serviceId}`);
      setIsFavorite(data.isFavorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revertir si falla
      setIsFavorite(isFavorite);
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "py-3 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
          : "py-5 bg-transparent border-b border-transparent"
      )}
    >
      <div className="container-app flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={cn(
              "group flex items-center gap-2 p-1 pr-4 rounded-full transition-all duration-300",
              scrolled ? "bg-secondary/20 hover:bg-secondary/40" : "bg-white/10 hover:bg-white/20 backdrop-blur-md"
            )}
          >
            <div className="p-2 bg-primary text-primary-foreground rounded-full shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block transition-colors text-foreground",
              scrolled ? "" : ""
            )}>
              Explorar
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleShare}
            disabled={isSharing}
            className={cn(
              "rounded-full transition-all duration-300 border-border/40 text-foreground",
              scrolled
                ? "bg-background/50 hover:bg-primary/10 hover:border-primary/30"
                : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 backdrop-blur-md"
            )}
          >
            <Share2 className={cn("w-4 h-4 transition-transform", isSharing && "scale-125")} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={toggleFavorite}
            className={cn(
              "rounded-full transition-all duration-300 border-border/40 shrink-0 text-foreground",
              isFavorite
                ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-lg shadow-red-500/10"
                : scrolled
                  ? "bg-background/50 hover:bg-red-500/10 hover:border-red-500/20"
                  : "bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 backdrop-blur-md"
            )}
          >
            <Heart className={cn("w-4 h-4 transition-all duration-500", isFavorite ? "fill-current scale-110" : "scale-100")} />
          </Button>

          <div className="h-8 w-px bg-border/20 mx-1 hidden sm:block" />

          <Link href={`/chat/new?vendorId=${vendorId}&serviceId=${serviceId}`} className="hidden sm:block">
            <Button className="rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 px-6 font-bold text-xs uppercase tracking-widest gap-2">
              Chat con Experto
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};
