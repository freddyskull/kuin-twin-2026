"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui';
import { ArrowRight, Star, MapPin, Search, Loader2, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useInfiniteServices, ServiceCard, useCategories } from "@/features/services";
import { Navbar } from "@/components/navbar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/auth.store";
import { useDeleteService } from "@/features/services";
import { toast } from "sonner";

/* ─── Variantes de animación reutilizables ─── */
const fadeUp: any = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay },
  }),
};

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSearch = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(currentSearch);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [isLoadingLoc, setIsLoadingLoc] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    setIsLoadingLoc(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLabel("Mi ubicación actual");
        setIsLoadingLoc(false);
        toast.success("Ubicación activada: Buscando cerca de ti");
      },
      (err) => {
        console.error("Geo error:", err);
        setIsLoadingLoc(false);
        toast.error("No pudimos obtener tu ubicación. Revisa los permisos.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const clearLocation = () => {
    setUserCoords(null);
    setLocationLabel("");
    toast.info("Filtro de proximidad desactivado");
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteServices({ 
    limit: 12,
    categoryId: currentCategory !== 'all' ? currentCategory : undefined,
    search: currentSearch || undefined,
    lat: userCoords?.lat,
    lng: userCoords?.lng,
    radius: 50 // Radio de 50km por defecto
  });

  const { data: categories = [] } = useCategories();
  const user = useAuthStore((state) => state.user);
  const deleteMutation = useDeleteService();

  const handleEdit = (service: any) => {
    // Redirigir al panel de administración para editar (Navegación entre APPs)
    window.location.href = `/admin/servicios/${service.id}/editar`;
  };

  const handleDelete = (service: any) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${service.title}"? Esta acción no se puede deshacer.`)) {
      deleteMutation.mutate(service.id, {
        onSuccess: () => {
          toast.success("Servicio eliminado correctamente");
        },
        onError: () => {
          toast.error("Hubo un error al eliminar el servicio");
        }
      });
    }
  };

  // Update URL function
  const updateFilters = (params: { category?: string; search?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.category !== undefined) {
      if (params.category === 'all') newParams.delete('category');
      else newParams.set('category', params.category);
    }

    if (params.search !== undefined) {
      if (!params.search) newParams.delete('search');
      else newParams.set('search', params.search);
    }

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFilters({ search: searchInput });
  };

  const clearSearch = () => {
    setSearchInput('');
    updateFilters({ search: '' });
  };

  // Sync search input with URL when navigating back/forward
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // ── Scroll Logic ──
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftPos(scrollRef.current.scrollLeft);
  };

  const onMouseUp = () => setIsDragging(false);
  const onMouseLeave = () => setIsDragging(false);

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

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
    <div className="relative min-h-screen">

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
          Encuentra la <span className="text-primary font-heading-italic">excelencia</span> a la vuelta de la esquina.
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
        <motion.form
          onSubmit={handleSearchSubmit}
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="¿Qué servicio necesitas hoy?"
              className="bg-transparent border-none outline-none w-full text-base py-3"
            />
            {searchInput && (
              <button type="button" onClick={clearSearch} className="p-1 hover:bg-accent rounded-full transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <div className="h-4 w-px bg-border hidden md:block" />
          <div className="flex-1 flex items-center gap-3 px-4 w-full relative">
            <MapPin className={cn("w-5 h-5 transition-colors", userCoords ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={locationLabel}
                onClick={handleGetLocation}
                placeholder="Buscar cerca de mí"
                className="bg-transparent border-none outline-none w-full text-base py-3 cursor-pointer placeholder:text-muted-foreground/60"
              />
              {isLoadingLoc && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
              {userCoords && !isLoadingLoc && (
                <button 
                  type="button" 
                  onClick={(e) => { e.stopPropagation(); clearLocation(); }} 
                  className="p-1 hover:bg-accent rounded-full transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            {!userCoords && !isLoadingLoc && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={handleGetLocation}
                className="text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 h-7 rounded-full"
              >
                Activar
              </Button>
            )}
          </div>
          <Button type="submit" className="w-full md:w-auto rounded-full py-6 px-8 text-lg gap-2 shadow-lg shadow-primary/20">
            Buscar
          </Button>
        </motion.form>

        {/* ── Categories Scroll ── */}
        <div className="w-full max-w-5xl mt-12 relative group/categories px-4">
          <AnimatePresence>
            {showLeftArrow && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll('left')}
                className="absolute -left-14 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.div 
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onMouseMove={onMouseMove}
            className={cn(
              "w-full flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing pb-2",
              isDragging && "scroll-auto select-none pointer-events-none *:pointer-events-auto"
            )}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
          >
            <button
              onClick={() => updateFilters({ category: 'all' })}
              className={cn(
                "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                currentCategory === 'all' 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                  : "bg-card border-border hover:border-primary/50 text-muted-foreground"
              )}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateFilters({ category: cat.id })}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                  currentCategory === cat.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                    : "bg-card border-border hover:border-primary/50 text-muted-foreground"
                )}
              >
                {cat.name}
              </button>
            ))}
          </motion.div>

          <AnimatePresence>
            {showRightArrow && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll('right')}
                className="absolute -right-14 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Services Section ── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="mt-24 w-full text-left"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10 pl-2">
            <div className="flex items-center gap-4">
              {currentSearch && (
                <>
                  <div className="h-8 w-1 bg-primary rounded-full" />
                  <h2 className="text-2xl font-bold">
                    Resultados para "{currentSearch}"
                  </h2>
                </>
              )}
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
                    <ServiceCard 
                      service={service} 
                      currentUserId={user?.id}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
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
            <div className="text-center py-20 opacity-60 flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                <Search className="h-8 w-8 text-muted-foreground opacity-20" />
              </div>
              <p>No se encontraron servicios con los filtros aplicados.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSearchInput('');
                  router.push(pathname);
                }}
                className="text-primary font-bold"
              >
                Limpiar todos los filtros
              </Button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
