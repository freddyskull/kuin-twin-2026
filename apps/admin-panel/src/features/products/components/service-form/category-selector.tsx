import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Check, Tag, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from 'ui-components';
import { useServicesStore } from '../../../../stores/services.store';

interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  children?: Category[];
}

interface CategorySelectorProps {
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ value, onChange, error }) => {
  const { categories } = useServicesStore();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  // Helper: Reconstruir árbol completo para asegurar niveles infinitos si el backend devuelve lista plana
  const categoryTree = useMemo(() => {
    // Si ya vienen con hijos, los usamos como base, pero el backend devuelve todos flat regularmente
    const map = new Map<string, Category>();
    categories.forEach(cat => map.set(cat.id, { ...cat, children: [] }));
    
    const roots: Category[] = [];
    categories.forEach(cat => {
      const node = map.get(cat.id)!;
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children!.push(node);
      } else if (!cat.parentId) {
        roots.push(node);
      }
    });
    
    // Si no hay roots claros (no hay null parentIds), usamos todos como roots como fallback
    return roots.length > 0 ? roots : categories.slice(0, 10); // Limit logic safety
  }, [categories]);

  // Helper: Aplanar con ruta completa para búsqueda
  const flattenedCategories = useMemo(() => {
    const flattened: Array<{ id: string; name: string; path: string[]; level: number; hasChildren: boolean }> = [];

    const flatten = (cats: Category[], currentPath: string[] = [], level: number = 0) => {
      cats.forEach(cat => {
        const path = [...currentPath, cat.name];
        const hasChildren = !!cat.children?.length;
        flattened.push({ id: cat.id, name: cat.name, path, level, hasChildren });
        if (hasChildren) {
          flatten(cat.children!, path, level + 1);
        }
      });
    };

    flatten(categoryTree);
    return flattened;
  }, [categoryTree]);

  // Selección actual
  const selectedCategory = useMemo(() => 
    flattenedCategories.find(c => c.id === value),
  [flattenedCategories, value]);

  // Filtrado
  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();
    if (!query) return flattenedCategories;
    return flattenedCategories.filter(cat => 
      cat.name.toLowerCase().includes(query) || 
      cat.path.join(' ').toLowerCase().includes(query)
    );
  }, [flattenedCategories, search]);

  // Teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const navigate = (direction: number) => {
      let nextIndex = activeIndex + direction;
      while (nextIndex >= 0 && nextIndex < filtered.length) {
        if (!filtered[nextIndex].hasChildren) {
          setActiveIndex(nextIndex);
          break;
        }
        nextIndex += direction;
      }
    };

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigate(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigate(-1);
    } else if (e.key === 'Enter' && filtered[activeIndex] && !filtered[activeIndex].hasChildren) {
      e.preventDefault();
      onChange(filtered[activeIndex].id);
      setIsOpen(false);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white flex items-center justify-between cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-primary/30",
          isOpen && "ring-2 ring-primary/30 border-primary/50 bg-white/10",
          error && "border-red-500/50"
        )}
      >
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-300">
            <Tag className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-0.5 opacity-60">
              {selectedCategory ? 'Categoría Seleccionada' : 'Servicio'}
            </span>
            <span className="text-sm font-bold truncate">
              {selectedCategory ? selectedCategory.name : 'Asignar categoría...'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {selectedCategory && (
             <span className="text-[9px] font-black uppercase bg-primary/20 text-primary px-2 py-1 rounded-md hidden md:block">
               {selectedCategory.path.length > 1 ? selectedCategory.path[0] : 'Raíz'}
             </span>
           )}
           <ChevronRight className={cn("h-4 w-4 text-slate-500 transition-all duration-300", isOpen && "rotate-90 text-primary")} />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.95, y: -20, filter: 'blur(10px)' }}
              className="absolute left-0 right-0 top-full mt-4 z-[70] bg-[#0c0d21] border border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl p-3"
            >
              <div className="relative mb-3">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  autoFocus
                  onKeyDown={handleKeyDown}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setActiveIndex(0); }}
                  placeholder="Escribe para buscar cualquier categoría..."
                  className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-white text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-500 font-medium"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto px-1 space-y-0.5 custom-scrollbar scroll-py-2 overflow-x-hidden">
                {filtered.map((cat, index) => {
                  const isParent = (cat.hasChildren && !search) || (cat.level === 0 && !search);
                  const canSelect = !cat.hasChildren;

                  return (
                    <button
                      key={cat.id}
                      type='button'
                      onMouseEnter={() => canSelect && setActiveIndex(index)}
                      onClick={() => {
                        if (!canSelect) return;
                        onChange(cat.id);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      style={{ paddingLeft: !isParent ? `${(cat.level * 1.5) + 1}rem` : '1rem' }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 group relative",
                        canSelect && activeIndex === index ? "bg-primary/20 translate-x-1" : (canSelect ? "hover:bg-white/5 cursor-pointer" : "cursor-default pointer-events-none"),
                        value === cat.id && "bg-primary/10 border border-primary/20",
                        isParent && "sticky top-0 z-20 bg-[#0c0d21]/95 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20 pointer-events-auto"
                      )}
                    >
                      <div className="flex items-center gap-4 min-w-0 z-10 w-full pr-8">
                        <div className={cn(
                          "p-2 rounded-xl transition-colors shrink-0",
                          activeIndex === index ? "bg-primary text-black shadow-lg shadow-primary/40" : "bg-white/5 text-slate-400 group-hover:text-white",
                          isParent && "bg-primary/10 text-primary border border-primary/20"
                        )}>
                          {isParent ? <Folder className="h-4 w-4" /> : <Folder className="h-3.5 w-3.5" />}
                        </div>
                        <div className="flex flex-col items-start min-w-0 flex-1">
                          {isParent && (
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-0.5 opacity-60">Sección Principal</span>
                          )}
                          {cat.path.length > 1 && search && (
                            <div className="flex items-center gap-1 mb-0.5 w-full overflow-hidden">
                              <span className="text-[9px] font-extrabold text-slate-500/60 uppercase tracking-tighter truncate">
                                {cat.path.slice(0, -1).join(' / ')}
                              </span>
                            </div>
                          )}
                          <span className={cn(
                            "text-sm font-bold transition-colors truncate w-full text-left",
                            activeIndex === index ? "text-white" : "text-slate-300",
                            value === cat.id && "text-primary font-black",
                            isParent && "text-white text-base"
                          )}>
                            {cat.name}
                          </span>
                        </div>
                      </div>
                      {value === cat.id && (
                        <div className="absolute right-4 z-10">
                          <Check className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      {activeIndex === index && (
                        <motion.div layoutId="selection" className="absolute inset-0 bg-primary/10 rounded-2xl z-0 pointer-events-none" />
                      )}
                    </button>
                  );
                })}

                {filtered.length === 0 && (
                  <div className="py-12 text-center">
                    <div className="mb-4 inline-flex p-4 rounded-full bg-white/5 ring-8 ring-white/[0.02]">
                       <Folder className="h-10 w-10 text-slate-700 opacity-20" />
                    </div>
                    <p className="text-slate-400 font-bold">No encontramos esa categoría</p>
                    <p className="text-slate-500 text-xs mt-1">Intenta con otros términos</p>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 px-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1">
                      <kbd className="h-5 min-w-[20px] items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-white/40 flex">↑↓</kbd>
                      <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Navegar</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <kbd className="h-5 min-w-[20px] items-center justify-center rounded border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] text-white/40 flex">↵</kbd>
                      <span className="text-[10px] text-white/20 uppercase font-black tracking-widest">Seleccionar</span>
                   </div>
                </div>
                <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">
                  {filtered.length} Sugerencias
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {error && <p className="text-red-500 text-xs mt-2 pl-1 font-bold animate-pulse">{error}</p>}
    </div>
  );
};
