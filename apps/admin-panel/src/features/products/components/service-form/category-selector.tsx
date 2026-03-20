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

  // Helper to get selected category info
  const selectedCategory = useMemo(() => {
    const findCategory = (cats: Category[]): Category | undefined => {
      for (const cat of cats) {
        if (cat.id === value) return cat;
        if (cat.children?.length) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    return findCategory(categories);
  }, [categories, value]);

  // Helper to flatten categories with their path for search
  const flattenedCategories = useMemo(() => {
    const flattened: Array<{ id: string; name: string; path: string[]; level: number }> = [];

    const flatten = (cats: Category[], currentPath: string[] = [], level: number = 0) => {
      cats.forEach(cat => {
        const path = [...currentPath, cat.name];
        flattened.push({ id: cat.id, name: cat.name, path, level });
        if (cat.children?.length) {
          flatten(cat.children, path, level + 1);
        }
      });
    };

    // If the store returns a flat list with parentId, we need to build the tree or handle it as flat.
    // Based on the store types, it's a tree. But if it's both, we should only start from roots.
    const roots = categories.filter(c => !c.parentId);
    flatten(roots.length > 0 ? roots : categories);

    return flattened;
  }, [categories]);

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!search) return flattenedCategories;
    return flattenedCategories.filter(cat =>
      cat.path.join(' > ').toLowerCase().includes(search.toLowerCase())
    );
  }, [flattenedCategories, search]);

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full bg-[#0a0b1e]/40 border border-white/5 rounded-xl py-3 px-4 text-white font-bold flex items-center justify-between cursor-pointer transition-all hover:bg-[#0a0b1e]/60 focus:ring-2 focus:ring-primary/30",
          isOpen && "ring-2 ring-primary/30",
          error && "border-red-500/50"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <Tag className="h-4 w-4 text-primary shrink-0" />
          <span className="truncate">
            {selectedCategory ? selectedCategory.name : 'Seleccionar categoría...'}
          </span>
        </div>
        <ChevronRight className={cn("h-4 w-4 text-slate-500 transition-transform", isOpen && "rotate-90")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#121432] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
            >
              <div className="p-3 border-b border-white/5 bg-white/5 flex items-center gap-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar categoría..."
                  className="bg-transparent border-none outline-none text-white text-sm w-full placeholder:text-slate-500"
                />
              </div>

              <div className="max-h-64 overflow-y-auto p-2 custom-scrollbar">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type='button'
                      onClick={() => {
                        onChange(cat.id);
                        setIsOpen(false);
                        setSearch('');
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/5 group text-left",
                        value === cat.id && "bg-primary/20"
                      )}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity shrink-0">
                          {cat.path.slice(0, -1).map((p, i) => (
                            <React.Fragment key={i}>
                              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-tighter ml-8 ">{p}</span>
                              <ChevronRight className="h-2 w-2 text-slate-600" />
                            </React.Fragment>
                          ))}
                        </div>
                        <span className={cn(
                          "text-sm font-semibold text-white",
                          value === cat.id && "text-primary"
                        )}>
                          {cat.name}
                        </span>
                      </div>
                      {value === cat.id && <Check className="h-4 w-4 text-primary shrink-0" />}
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <Folder className="h-8 w-8 text-slate-700 mx-auto mb-2 opacity-20" />
                    <p className="text-slate-500 text-xs">No se encontraron categorías</p>
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-white/5 bg-white/[0.02]">
                <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold py-1">
                  {filteredCategories.length} categorías disponibles
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {error && <p className="text-red-500 text-xs mt-1 pl-1">{error}</p>}
    </div>
  );
};
