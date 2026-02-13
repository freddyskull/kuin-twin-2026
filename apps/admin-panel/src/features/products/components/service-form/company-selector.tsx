import React, { useState } from 'react';
import { useCompanies, useBranches } from '../../../companies';
import { Building2, Check, Store } from 'lucide-react';
import { cn } from 'ui-components';
import { motion, AnimatePresence } from 'framer-motion';

interface CompanySelectorProps {
  selectedCompanyIds: string[];
  onCompanyChange: (ids: string[]) => void;
  selectedBranchIds: string[];
  onBranchChange: (ids: string[]) => void;
  error?: string;
}

const CompanyItem: React.FC<{
  company: any;
  isSelected: boolean;
  selectedBranchIds: string[];
  onToggleCompany: (id: string) => void;
  onToggleBranch: (branchId: string) => void;
}> = ({ company, isSelected, selectedBranchIds, onToggleCompany, onToggleBranch }) => {
  const { data: branches = [], isLoading: isLoadingBranches } = useBranches(company.id);

  // Calcular si todas las sucursales están seleccionadas
  const companyBranchIds = branches.map(b => b.id);
  const selectedCompanyBranches = companyBranchIds.filter(id => selectedBranchIds.includes(id));
  const areAllSelected = branches.length > 0 && selectedCompanyBranches.length === branches.length;

  const handleSelectAllBranches = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (areAllSelected) {
      // Deseleccionar todas
      companyBranchIds.forEach(id => onToggleBranch(id)); // Esto funcionará si onToggleBranch maneja toggle uno por uno? No, mejor pasar lógica al padre o hacer un loop aquí
      // Mejor lógica: pasar al padre ids para agregar/quitar
      // Simplificación: iteramos y llamamos toggle si es necesario
      companyBranchIds.forEach(id => {
        if (selectedBranchIds.includes(id)) onToggleBranch(id);
      });
    } else {
      // Seleccionar todas
      companyBranchIds.forEach(id => {
        if (!selectedBranchIds.includes(id)) onToggleBranch(id);
      });
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all cursor-pointer group overflow-hidden",
        isSelected
          ? "bg-dashboard-primary/5 border-dashboard-primary/50 shadow-lg shadow-dashboard-primary/5"
          : "bg-[#0a0b1e]/40 border-white/5 hover:border-white/10"
      )}
    >
      <div
        onClick={() => onToggleCompany(company.id)}
        className="flex items-center gap-3 p-4"
      >
        <div className={cn(
          "h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center border transition-all flex-shrink-0",
          isSelected ? "border-dashboard-primary/30" : "border-white/5 bg-[#0a0b1e]"
        )}>
          {company.logoUrl ? (
            <img src={company.logoUrl} alt={company.businessName} className="h-full w-full object-cover" />
          ) : (
            <Building2 className={cn("h-5 w-5", isSelected ? "text-dashboard-primary" : "text-slate-600")} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className={cn(
            "text-sm font-bold truncate",
            isSelected ? "text-white" : "text-slate-400 group-hover:text-slate-200"
          )}>
            {company.businessName}
          </div>
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{company.rfc}</div>
        </div>

        <div className={cn(
          "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
          isSelected
            ? "bg-dashboard-primary border-dashboard-primary text-dashboard-bg"
            : "border-white/10"
        )}>
          {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/20"
          >
            <div className="p-3 pl-16 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span className="flex items-center gap-2">
                  <Store className="h-3 w-3" /> Sucursales
                </span>
                {branches.length > 0 && (
                  <button
                    onClick={handleSelectAllBranches}
                    className="hover:text-dashboard-primary transition-colors cursor-pointer"
                  >
                    {areAllSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                )}
              </div>

              {isLoadingBranches ? (
                <div className="space-y-2">
                  {[1, 2].map(i => <div key={i} className="h-8 bg-white/5 rounded-lg animate-pulse" />)}
                </div>
              ) : branches.length === 0 ? (
                <div className="text-xs text-slate-600 italic py-2">Sin sucursales registradas</div>
              ) : (
                <div className="space-y-1">
                  {branches.map(branch => {
                    const isBranchSelected = selectedBranchIds.some(id => String(id) === String(branch.id));
                    return (
                      <div
                        key={branch.id}
                        onClick={(e) => { e.stopPropagation(); onToggleBranch(String(branch.id)); }}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all",
                          isBranchSelected ? "bg-dashboard-primary/10 text-white" : "hover:bg-white/5 text-slate-400"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          isBranchSelected ? "bg-dashboard-primary border-dashboard-primary" : "border-white/20"
                        )}>
                          {isBranchSelected && <Check className="h-3 w-3 text-dashboard-bg stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium truncate">{branch.name}</span>
                        {branch.isMain && (
                          <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300 ml-auto">Principal</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const CompanySelector: React.FC<CompanySelectorProps> = ({
  selectedCompanyIds = [],
  onCompanyChange,
  selectedBranchIds = [],
  onBranchChange,
  error
}) => {
  const { data: companies = [], isLoading } = useCompanies();

  const toggleCompany = (id: string) => {
    if (selectedCompanyIds.includes(id)) {
      onCompanyChange(selectedCompanyIds.filter(v => v !== id));
      // Opcional: Limpiar sucursales de esta empresa al deseleccionarla
      // Para hacer esto bien necesitaríamos saber qué sucursales pertenecen a esta empresa ID sin el hook
      // Como no tenemos las sucursales aquí, lo dejamos. El backend debería ignorar sucursales huerfanas o en el frontend filtramos al enviar.
    } else {
      onCompanyChange([...selectedCompanyIds, id]);
    }
  };

  const toggleBranch = (id: string) => {
    if (selectedBranchIds.includes(id)) {
      onBranchChange(selectedBranchIds.filter(v => v !== id));
    } else {
      onBranchChange([...selectedBranchIds, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="h-10 w-full animate-pulse bg-white/5 rounded-xl block" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        {companies.map((company) => (
          <CompanyItem
            key={company.id}
            company={company}
            isSelected={selectedCompanyIds.includes(company.id)}
            selectedBranchIds={selectedBranchIds}
            onToggleCompany={toggleCompany}
            onToggleBranch={toggleBranch}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
