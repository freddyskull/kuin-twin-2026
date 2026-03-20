"use client";

import { useRef, useEffect, useCallback, useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from '@/components/ui';
import { ArrowRight, Star, MapPin, Search, Loader2, Sparkles, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useInfiniteServices, ServiceCard, useCategories, useDeleteService } from "@/features/services";
import { Navbar } from "@/components/navbar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/features/auth/auth.store";
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

function HomeContent() {
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
  });

  const { data: categories = [] } = useCategories();
  const user = useAuthStore((state) => state.user);
  const deleteMutation = useDeleteService();

  const handleEdit = (service: any) => {
    window.location.href = `/admin/servicios/${service.id}/editar`;
  };

  const handleDelete = (service: any) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${service.title}"?`)) {
      deleteMutation.mutate(service.id);
    }
  };

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

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

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

  const services = data?.pages.flatMap((p) => p.items) ?? [];
  const total = data?.pages[0]?.total ?? 0;
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
    const observer = new IntersectionObserver(handleObserver, { rootMargin: "300px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <main className="relative z-10 container-app pt-20 pb-32 flex flex-col items-center text-center">
      {/* Badge */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 border border-primary/20">
        <Star className="w-3 h-3 fill-primary" />
        <span>LO MEJOR DE 2026 EN SERVICIOS LOCALES</span>
      </motion.div>

      {/* Hero Title */}
      <motion.h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl" variants={fadeUp} initial="hidden" animate="visible" custom={0.1}>
        Encuentra la <span className="text-primary font-heading-italic">excelencia</span> a la vuelta de la esquina.
      </motion.h1>

      {/* Subtitle */}
      <motion.p className="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12" variants={fadeUp} initial="hidden" animate="visible" custom={0.2}>
        Kuin-Twin conecta a los mejores profesionales con personas que buscan un servicio impecable. Rápido, seguro y cerca de ti.
      </motion.p>

      {/* Search Bar */}
      <motion.form onSubmit={handleSearchSubmit} className="w-full max-w-3xl p-2 bg-card border border-border shadow-2xl rounded-2xl md:rounded-full flex flex-col md:flex-row items-center gap-2" variants={fadeUp} initial="hidden" animate="visible" custom={0.3}>
        <div className="flex-1 flex items-center gap-3 px-4 w-full">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="¿Qué servicio necesitas hoy?" className="bg-transparent border-none outline-none w-full text-base py-3" />
          {searchInput && (
            <button type="button" onClick={() => { setSearchInput(''); updateFilters({ search: '' }); }} className="p-1 hover:bg-accent rounded-full transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="h-4 w-px bg-border hidden md:block" />
        <div className="flex-1 flex items-center gap-3 px-4 w-full relative">
          <MapPin className={cn("w-5 h-5 transition-colors", userCoords ? "text-primary" : "text-muted-foreground")} />
          <input type="text" readOnly value={locationLabel} onClick={handleGetLocation} placeholder="Buscar cerca de mí" className="bg-transparent border-none outline-none w-full text-base py-3 cursor-pointer" />
          {isLoadingLoc && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          {userCoords && <button type="button" onClick={(e) => { e.stopPropagation(); clearLocation(); }} className="p-1 hover:bg-accent rounded-full transition-colors"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
        </div>
        <Button type="submit" className="w-full md:w-auto rounded-full py-6 px-8 text-lg gap-2 shadow-lg shadow-primary/20">Buscar</Button>
      </motion.form>

      {/* Categories */}
      <div className="w-full max-w-5xl mt-12 relative group/categories px-4">
        <motion.div ref={scrollRef} onScroll={checkScroll} className="w-full flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth pb-2" variants={fadeUp} initial="hidden" animate="visible" custom={0.4}>
          <button onClick={() => updateFilters({ category: 'all' })} className={cn("px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border", currentCategory === 'all' ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-card border-border hover:border-primary/50 text-muted-foreground")}>Todos</button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => updateFilters({ category: cat.id })} className={cn("px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border", currentCategory === cat.id ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" : "bg-card border-border hover:border-primary/50 text-muted-foreground")}>{cat.name}</button>
          ))}
        </motion.div>
      </div>

      {/* Services Grid */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0.5} className="mt-24 w-full text-left">
        <div className="flex items-center justify-between mb-10 pl-2">
          <div className="flex items-center gap-4">
            <div className="h-8 w-1 bg-primary rounded-full" />
            <h2 className="text-2xl font-bold">{currentSearch ? `Resultados para "${currentSearch}"` : 'Populares cerca de ti'}</h2>
          </div>
          {!isLoading && total > 0 && <span className="text-sm text-muted-foreground font-semibold bg-card border border-border/50 px-3 py-1.5 rounded-full">{services.length} / {total} servicios</span>}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 rounded-2xl bg-card border border-border/50 animate-pulse" />)}
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, i) => (
                <motion.div key={service.id} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={(i % 12) * 0.06} className="h-full">
                  <ServiceCard service={service} currentUserId={user?.id} onEdit={handleEdit} onDelete={handleDelete} />
                </motion.div>
              ))}
            </div>
            <div ref={sentinelRef} className="h-2 w-full mt-4" />
            {isFetchingNextPage && <div className="flex justify-center mt-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
          </>
        ) : (
          <div className="text-center py-20 opacity-60 flex flex-col items-center gap-4">
            <Search className="h-12 w-12 text-muted-foreground opacity-20" />
            <p>No se encontraron servicios.</p>
            <Button variant="link" onClick={() => router.push(pathname)} className="text-primary font-bold">Limpiar filtros</Button>
          </div>
        )}
      </motion.div>
    </main>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
        </div>
      }>
        <HomeContent />
      </Suspense>
    </div>
  );
}
