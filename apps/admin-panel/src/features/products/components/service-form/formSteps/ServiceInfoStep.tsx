import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Settings, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';

export const ServiceInfoStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<ServiceFormValues>();
  const { categories } = useServicesStore();

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
          <div className="relative">
            <select {...register('categoryId')} className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-xl py-3 px-4 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all cursor-pointer">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Descripción</label>
          <textarea {...register('description')} rows={5} placeholder="Describe tu servicio..." className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-2xl py-4 px-5 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all resize-none placeholder:text-slate-700" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
      </div>
    </motion.section>
  );
};
