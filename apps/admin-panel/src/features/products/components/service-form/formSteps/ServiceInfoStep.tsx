import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';
import { CategorySelector } from '../CategorySelector';
import { CompanySelector } from '../company-selector';

export const ServiceInfoStep: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<ServiceFormValues>();
  const { fetchMetadata } = useServicesStore();

  React.useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return (
    <motion.section
      key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Settings className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Detalles Básicos</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Título</label>
          <input {...register('title')} placeholder="ej. Limpieza a Vapor Master" className="w-full bg-transparent border-b border-white/10 py-4 text-xl text-white font-medium focus:outline-none focus:border-dashboard-primary transition-all placeholder:text-slate-700" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Categoría</label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <CategorySelector
                value={field.value}
                onChange={field.onChange}
                error={errors.categoryId?.message}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Descripción</label>
          <textarea {...register('description')} rows={5} placeholder="Describe tu servicio..." className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all resize-none placeholder:text-slate-700" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="space-y-4">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Empresas y Sucursales Asociadas</label>
          <Controller
            name="companyIds"
            control={control}
            render={({ field: companyField }) => (
              <Controller
                name="branchIds"
                control={control}
                render={({ field: branchField }) => (
                  <CompanySelector
                    selectedCompanyIds={companyField.value}
                    onCompanyChange={companyField.onChange}
                    selectedBranchIds={branchField.value || []}
                    onBranchChange={branchField.onChange}
                    error={errors.companyIds?.message}
                  />
                )}
              />
            )}
          />
        </div>
      </div>
    </motion.section>
  );
};
