import React from 'react';
import { useCompanies } from '../../../companies/companies.hooks';
import { Building2, Check } from 'lucide-react';
import { cn } from 'ui-components';

interface CompanySelectorProps {
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const CompanySelector: React.FC<CompanySelectorProps> = ({ value = [], onChange, error }) => {
  const { data: companies = [], isLoading } = useCompanies();

  const toggleCompany = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter(v => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="h-10 w-full animate-pulse bg-white/5 rounded-xl block" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => toggleCompany(company.id)}
            className={cn(
              "flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group",
              value.includes(company.id)
                ? "bg-dashboard-primary/10 border-dashboard-primary shadow-lg shadow-dashboard-primary/5"
                : "bg-[#0a0b1e]/40 border-white/5 hover:border-white/10"
            )}
          >
            <div className={cn(
              "h-10 w-10 rounded-xl overflow-hidden flex items-center justify-center border transition-all",
              value.includes(company.id) ? "border-dashboard-primary/30" : "border-white/5 bg-[#0a0b1e]"
            )}>
              {company.logoUrl ? (
                <img src={company.logoUrl} alt={company.businessName} className="h-full w-full object-cover" />
              ) : (
                <Building2 className={cn("h-5 w-5", value.includes(company.id) ? "text-dashboard-primary" : "text-slate-600")} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className={cn(
                "text-sm font-bold truncate",
                value.includes(company.id) ? "text-white" : "text-slate-400 group-hover:text-slate-200"
              )}>
                {company.businessName}
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{company.rfc}</div>
            </div>

            <div className={cn(
              "h-5 w-5 rounded-full border flex items-center justify-center transition-all",
              value.includes(company.id)
                ? "bg-dashboard-primary border-dashboard-primary text-dashboard-bg"
                : "border-white/10"
            )}>
              {value.includes(company.id) && <Check className="h-3 w-3 stroke-[3]" />}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};
