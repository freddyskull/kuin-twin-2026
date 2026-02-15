import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Image as ImageIcon, Lightbulb } from 'lucide-react';
import type { ServiceFormValues } from './schema';
import { useServicesStore } from '../../../../stores/services.store';

interface ServicePreviewProps {
  currentStep: number;
}

export const ServicePreview: React.FC<ServicePreviewProps> = ({ currentStep }) => {
  const { control } = useFormContext<ServiceFormValues>();
  const watchedValues = useWatch({ control });
  const { categories, units } = useServicesStore();

  return (
    <div className="col-span-4 space-y-6">
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Vista Previa</h3>
        <div className="bg-[#0a0b1e] border border-white/5 rounded-3xl overflow-hidden group shadow-xl">
          <div className="h-56 bg-[#1a1c3d] relative">
            {watchedValues.imageUrl ? (
              <img src={watchedValues.imageUrl.startsWith('http') ? watchedValues.imageUrl : `http://localhost:3001${watchedValues.imageUrl}`} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-700">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white truncate">{watchedValues.title || 'Servicio sin título'}</h4>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                {categories.find(c => c.id === watchedValues.categoryId)?.name || 'Category'}
              </p>
            </div>

            <div className="flex items-baseline gap-1 pt-2 border-t border-white/5">
              {(watchedValues.metadata || []).find((m: any) => m.key === 'Precio') ? (
                <span className="text-2xl font-black text-dashboard-primary">${watchedValues.metadata?.find((m: any) => m.key === 'Precio')?.value}</span>
              ) : (
                <span className="text-2xl font-black text-dashboard-primary">${Number(watchedValues.basePrice || 0).toLocaleString()}</span>
              )}
              <span className="text-[9px] font-bold text-slate-500 uppercase">/ {units.find(u => u.id === watchedValues.unitId)?.abbreviation || 'Unidad'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1c3d]/20 border border-white/5 rounded-2xl p-6 flex gap-4">
        <Lightbulb className="h-5 w-5 text-dashboard-primary shrink-0" />
        <p className="text-slate-400 text-xs font-medium leading-relaxed">
          {currentStep === 1 && "Los títulos claros funcionan mejor."}
          {currentStep === 2 && "Precios estándar reducen la fricción."}
          {currentStep === 3 && "Lo visual vende la experiencia."}
          {currentStep >= 4 && "Los detalles generan confianza."}
        </p>
      </div>
    </div>
  );
};
