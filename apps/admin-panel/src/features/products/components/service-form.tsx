import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const serviceSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  basePrice: z.coerce.number().min(1, 'el precio debe ser mayor a 0'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  unitId: z.string().min(1, 'La unidad es requerida'),
  isActive: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  onClose: () => void;
  onSubmit: (data: ServiceFormValues) => Promise<void>;
  initialData?: any;
  title: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ onClose, onSubmit, initialData, title }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema as any),
    defaultValues: initialData || { isActive: true },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="glass-card bg-card border border-white/10 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-heading font-black text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl border border-white/5 text-slate-500 hover:text-white transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-heading font-black text-slate-500 uppercase tracking-widest pl-1">Título del Servicio</label>
            <input
              {...register('title')}
              placeholder="ej. Conserje de Spa de Lujo"
              className="w-full bg-accent/30 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
            />
            {errors.title && <p className="text-red-500 text-xs font-bold pl-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-heading font-black text-slate-500 uppercase tracking-widest pl-1">Descripción</label>
            <textarea
              {...register('description')}
              placeholder="Describe tu servicio en detalle..."
              rows={4}
              className="w-full bg-accent/30 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-sans"
            />
            {errors.description && <p className="text-red-500 text-xs font-bold pl-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-heading font-black text-slate-500 uppercase tracking-widest pl-1">Precio Base ($)</label>
              <input
                {...register('basePrice')}
                type="number"
                step="0.01"
                placeholder="180.00"
                className="w-full bg-accent/30 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
              />
              {errors.basePrice && <p className="text-red-500 text-xs font-bold pl-1">{errors.basePrice.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-heading font-black text-slate-500 uppercase tracking-widest pl-1">Estado</label>
              <select
                {...register('isActive', { setValueAs: (v) => v === 'true' })}
                className="w-full bg-accent/30 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none font-sans"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Hidden fields for required category/unit for now */}
          <input type="hidden" {...register('categoryId')} value="placeholder-category" />
          <input type="hidden" {...register('unitId')} value="placeholder-unit" />

          <div className="pt-4 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 text-slate-400 py-4 rounded-2xl font-heading font-black hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-primary text-primary-foreground py-4 rounded-2xl font-heading font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Servicio'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
