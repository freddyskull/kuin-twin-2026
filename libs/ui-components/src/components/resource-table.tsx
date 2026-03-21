import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Plus } from 'lucide-react';
import { DataTable } from './data-table';
import { Pagination } from './pagination';
import { Button } from './ui/button';
import { ColumnDef } from '@tanstack/react-table';

interface ResourceTableProps<TData> {
  title: string;
  hideTitle?: boolean;
  subtitle?: string;
  total?: number;
  isLoading?: boolean;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  emptyMessage?: string;
  
  // Search
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
  
  // Filters
  filters?: React.ReactNode;
  
  // Create Button (Optional)
  createButton?: {
    label: string;
    onClick: () => void;
  };
  
  // Pagination
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function ResourceTable<TData>({
  title,
  hideTitle = false,
  subtitle,
  total,
  isLoading,
  columns,
  data,
  emptyMessage,
  search,
  filters,
  createButton,
  pagination
}: ResourceTableProps<TData>) {
  // Local state for the search input to avoid lag with URL sync
  const [localSearch, setLocalSearch] = useState(search?.value || '');

  // Sync local state when external value changes (e.g. initial load or reset)
  useEffect(() => {
    if (search?.value !== undefined) {
      setLocalSearch(search.value);
    }
  }, [search?.value]);

  // Debounce the actual search change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search && localSearch !== search.value) {
        search.onChange(localSearch);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timer);
  }, [localSearch, search]);

  return (
    <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto pb-10 font-sans">
      {!hideTitle && (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
              {total !== undefined && !isLoading && (
                <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
                  {total}
                </span>
              )}
            </div>
            {subtitle && <p className="text-muted-foreground text-xs md:text-sm">{subtitle}</p>}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {search && (
              <div className="relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder={search.placeholder || "Buscar..."}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="h-10 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border text-xs font-medium focus:ring-1 focus:ring-primary/30 outline-none w-full sm:w-[250px] transition-all"
                />
              </div>
            )}

            {filters && (
              <div className="flex bg-secondary/50 p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
                {filters}
              </div>
            )}
            
            {createButton && (
              <Button 
                onClick={createButton.onClick}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createButton.label}
              </Button>
            )}
          </div>
        </div>
      )}

      {hideTitle && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            {total !== undefined && !isLoading && (
              <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-wider">
                {total} registros
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {search && (
              <div className="relative group">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder={search.placeholder || "Buscar..."}
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="h-10 pl-10 pr-4 rounded-xl bg-secondary/50 border border-border text-xs font-medium focus:ring-1 focus:ring-primary/30 outline-none w-full sm:w-[200px] transition-all"
                />
              </div>
            )}

            {filters && (
              <div className="flex bg-secondary/50 p-1 rounded-xl border border-border overflow-x-auto no-scrollbar">
                {filters}
              </div>
            )}
            
            {createButton && (
              <Button 
                onClick={createButton.onClick}
                className="h-10 px-5 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                {createButton.label}
              </Button>
            )}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden relative">
        <div className="overflow-x-auto custom-scrollbar">
          <div className="min-w-[800px]">
            <DataTable
              columns={columns}
              data={data}
              isLoading={isLoading}
              emptyMessage={emptyMessage}
              className="border-none"
            />
          </div>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-border bg-secondary/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest order-2 sm:order-1 text-center sm:text-left">
              Mostrando <span className="text-foreground">{data.length}</span> de <span className="text-foreground">{total || data.length}</span> registros
            </div>
            <div className="order-1 sm:order-2">
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={pagination.onPageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
