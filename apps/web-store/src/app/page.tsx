"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui';
import { ArrowRight, Star, MapPin, Search, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useInfiniteServices, ServiceCard } from "@/features/services";
import { Navbar } from "@/components/navbar";

/* ─── Variantes de animación reutilizables ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

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
      rootMargin: "300px",
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
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20"
        >
          <Star className="w-3 h-3 fill-primary" />
          <span>LO MEJOR DE 2026 EN SERVICIOS LOCALES</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
        >
          Encuentra la <span className="text-primary italic font-serif">excelencia</span> a la vuelta de la esquina.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
        >
          Kuin-Twin conecta a los mejores profesionales con personas que buscan un servicio impecable. Rápido, seguro y cerca de ti.
        </motion.p>

        {/* Search Bar Premium */}
        <motion.div
          className="w-full max-w-3xl p-2 bg-card border border-border shadow-2xl rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
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

        {/* ── Services Section ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="mt-24 w-full text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10 pl-2">
            <div className="flex items-center gap-4">
              <div className="h-8 w-1 bg-primary rounded-full" />
              <h2 className="text-2xl font-bold">Populares cerca de ti</h2>
            </div>
            <AnimatePresence>
              {!isLoading && total > 0 && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm text-muted-foreground font-semibold bg-card border border-border/50 px-3 py-1.5 rounded-full"
                >
                  {services.length} / {total} servicios
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Skeleton de carga inicial */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="h-72 rounded-2xl bg-card border border-border/50 animate-pulse"
                />
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
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    custom={(i % 12) * 0.06}
                    className="h-full"
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>

              {/* Sentinel invisible para auto-carga */}
              <div ref={sentinelRef} className="h-2 w-full mt-4" />

              {/* Spinner al cargar siguiente página */}
              <AnimatePresence>
                {isFetchingNextPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex flex-col items-center gap-3 mt-10 py-6"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                      <Sparkles className="w-4 h-4 text-primary absolute inset-0 m-auto" />
                    </div>
                    <span className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">
                      Cargando más servicios…
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botón de carga manual (respaldo) */}
              <AnimatePresence>
                {hasNextPage && !isFetchingNextPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center mt-8"
                  >
                    <Button
                      variant="outline"
                      onClick={() => fetchNextPage()}
                      className="rounded-full px-10 py-5 gap-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all group"
                    >
                      Ver más servicios
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Fin de resultados */}
              <AnimatePresence>
                {!hasNextPage && !isFetchingNextPage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-center mt-14 py-10 border-t border-border/30"
                  >
                    <p className="text-2xl mb-2">🎉</p>
                    <p className="text-muted-foreground text-sm font-medium">
                      Has visto los{" "}
                      <span className="text-primary font-bold">{total}</span>{" "}
                      servicios disponibles
                    </p>
                    <Link href="/registro">
                      <Button variant="outline" className="mt-5 rounded-full gap-2 group">
                        ¿Eres proveedor? Únete
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
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
