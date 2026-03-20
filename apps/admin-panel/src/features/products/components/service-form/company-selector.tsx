import React from 'react';
import { useCompanies, useBranches } from '../../../companies';
import { Building2, Check, Store } from 'lucide-react';
import { cn, getAbsoluteUrl } from 'ui-components';
import { motion, AnimatePresence } from 'framer-motion';

interface CompanySelectorProps {
  selectedCompanyId?: string;
  onCompanyChange: (id: string) => void;
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

  const companyBranchIds = branches.map(b => b.id);
  const selectedCompanyBranches = companyBranchIds.filter(id => selectedBranchIds.includes(id));
  const areAllSelected = branches.length > 0 && selectedCompanyBranches.length === branches.length;

  const handleSelectAllBranches = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (areAllSelected) {
      companyBranchIds.forEach(id => {
        if (selectedBranchIds.includes(id)) onToggleBranch(id);
      });
    } else {
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
          ? "bg-primary/5 border-primary/50 shadow-lg shadow-primary/5"
          : "bg-[#0a0b1e]/40 border-white/5 hover:border-white/10"
      )}
    >
      <div
        onClick={() => onToggleCompany(company.id)}
        className="flex items-center gap-3 p-4"
      >
        <div className={cn(
          "h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center border transition-all flex-shrink-0",
          isSelected ? "border-primary/30" : "border-white/5 bg-[#0a0b1e]"
        )}>
          {company.logoUrl ? (
            <img src={getAbsoluteUrl(company.logoUrl) || ''} alt={company.businessName} className="h-full w-full object-cover" />
          ) : (
            <Building2 className={cn("h-5 w-5", isSelected ? "text-primary" : "text-slate-600")} />
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
            ? "bg-primary border-primary text-primary"
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
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    {areAllSelected ? 'Deseleccionar todas' : 'Seleccionar todas'}
                  </button>
                )}
              </div>

              {isLoadingBranches ? (
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/5 animate-pulse rounded" />
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
                          isBranchSelected ? "bg-primary/10 text-white" : "hover:bg-white/5 text-slate-400"
                        )}
                      >
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-all",
                          isBranchSelected ? "bg-primary border-primary" : "border-white/20"
                        )}>
                          {isBranchSelected && <Check className="h-3 w-3 text-primary stroke-[3]" />}
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
  selectedCompanyId,
  onCompanyChange,
  selectedBranchIds = [],
  onBranchChange,
  error
}) => {
  const { data: companies = [], isLoading } = useCompanies();

  const toggleCompany = (id: string) => {
    if (selectedCompanyId === id) {
      onCompanyChange('');
      onBranchChange([]); // Limpiar sucursales al deseleccionar empresa
    } else {
      onCompanyChange(id);
      onBranchChange([]); // Limpiar sucursales anteriores al cambiar de empresa
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
      <div className="grid grid-cols-1 gap-3">
        {[1, 2].map(i => <div key={i} className="h-20 w-full animate-pulse bg-white/5 rounded-2xl block" />)}
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-[#0a0b1e]/20 border border-white/5 rounded-2xl opacity-50 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-slate-600" />
          <div className="text-sm font-bold text-slate-500">Sin empresas disponibles</div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {companies.map((company) => (
          <CompanyItem
            key={company.id}
            company={company}
            isSelected={selectedCompanyId === company.id}
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
