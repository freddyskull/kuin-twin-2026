"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from '@/components/ui';
import { ArrowRight, Star, MapPin, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import { useInfiniteServices, ServiceCard } from "@/features/services";
import { Navbar } from "@/components/navbar";

export default function Home() {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteServices(12);

  // Aplanar todas las páginas en un solo array
  const services = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Sentinel ref para IntersectionObserver (carga automática al scroll)
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "200px", // Carga 200px antes de llegar al final
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Orbs — fixed para no interferir con el scroll */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] pointer-events-none z-0" />

      <Navbar />

      <main className="relative z-10 container-app pt-20 pb-32 flex flex-col items-center text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20"
        >
          <Star className="w-3 h-3 fill-primary" />
          <span>LO MEJOR DE 2026 EN SERVICIOS LOCALES</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Encuentra la <span className="text-primary italic font-serif">excelencia</span> a la vuelta de la esquina.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Kuin-Twin conecta a los mejores profesionales con personas que buscan un servicio impecable. Rápido, seguro y cerca de ti.
        </motion.p>

        {/* Search Bar Premium */}
        <motion.div
          className="w-full max-w-3xl p-2 bg-card border border-border shadow-2xl rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="¿Qué servicio necesitas hoy?"
              className="bg-transparent border-none outline-none w-full text-base py-3"
            />
          </div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <div className="flex-1 flex items-center gap-3 px-4 w-full">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Ubicación"
              className="bg-transparent border-none outline-none w-full text-base py-3"
            />
          </div>
          <Button className="w-full md:w-auto rounded-full py-6 px-8 text-lg gap-2 shadow-lg shadow-primary/20">
            Buscar
          </Button>
        </motion.div>

        {/* Services Grid con Scroll Infinito */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 w-full text-left"
        >
          {/* Header con contador */}
          <div className="flex items-center justify-between mb-8 pl-2">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">
              Populares cerca de ti
            </h2>
            {!isLoading && total > 0 && (
              <span className="text-sm text-muted-foreground font-bold">
                {services.length} de {total} servicios
              </span>
            )}
          </div>

          {/* Skeleton de carga inicial */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="h-72 rounded-2xl bg-card border border-border/50 animate-pulse" />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-20 bg-destructive/10 rounded-xl border border-destructive/20 text-destructive">
              <p>Hubo un error al cargar los servicios. Por favor intenta más tarde.</p>
            </div>
          )}

          {/* Grid de servicios */}
          {!isLoading && !isError && services.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {services.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i % 12, 11) * 0.05 }}
                    className="h-full"
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>

              {/* Sentinel invisible para carga automática */}
              <div ref={sentinelRef} className="h-1 w-full" />

              {/* Spinner al cargar siguiente página */}
              {isFetchingNextPage && (
                <div className="flex justify-center mt-6 py-6">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}

              {/* Botón de carga manual como respaldo visible */}
              {hasNextPage && !isFetchingNextPage && (
                <div className="flex justify-center mt-8">
                  <Button
                    variant="outline"
                    onClick={() => fetchNextPage()}
                    className="rounded-full px-8 py-5 gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all"
                  >
                    Cargar más servicios <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Fin de resultados */}
              {!hasNextPage && !isFetchingNextPage && (
                <div className="text-center mt-10 py-8 border-t border-border/30">
                  <p className="text-muted-foreground text-sm font-medium">
                    🎉 Has visto todos los <span className="text-primary font-bold">{total}</span> servicios disponibles
                  </p>
                  <Link href="/registro">
                    <Button variant="outline" className="mt-4 rounded-full gap-2">
                      ¿Eres proveedor? Únete <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Vacío */}
          {!isLoading && !isError && services.length === 0 && (
            <div className="text-center py-20 opacity-60">
              <p>No se encontraron servicios disponibles en este momento.</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
