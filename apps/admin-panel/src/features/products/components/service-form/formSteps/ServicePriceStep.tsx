import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DollarSign, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';

export const ServicePriceStep: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<ServiceFormValues>();
  const { units } = useServicesStore();

  return (
    <motion.section
      key="step2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <DollarSign className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Precio</h2>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Precio ($)</label>
          <input {...register('basePrice')} type="number" step="0.01" className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-xl py-3 px-4 text-xl text-white font-black focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30" />
          {errors.basePrice && <p className="text-red-500 text-xs mt-1">{errors.basePrice.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Unidad</label>
          <div className="relative">
            <select {...register('unitId')} className="w-full bg-[#0a0b1e]/40 border border-white/5 rounded-xl py-3 px-4 text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-dashboard-primary/30 transition-all cursor-pointer">
              {units.map(u => <option key={u.id} value={u.id}>{u.name} ({u.abbreviation})</option>)}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
