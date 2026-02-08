import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const serviceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  basePrice: z.coerce.number().min(1, 'Price must be greater than 0'),
  categoryId: z.string().min(1, 'Category is required'),
  unitId: z.string().min(1, 'Unit is required'),
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
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || { isActive: true },
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-dashboard-bg/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-[#11122d] border border-white/10 rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl"
      >
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-xl border border-white/5 text-slate-500 hover:text-white transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Service Title</label>
            <input
              {...register('title')}
              placeholder="e.g. Luxury Spa Concierge"
              className="w-full bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 transition-all"
            />
            {errors.title && <p className="text-red-500 text-xs font-bold pl-1">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Description</label>
            <textarea
              {...register('description')}
              placeholder="Describe your service in detail..."
              rows={4}
              className="w-full bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 transition-all resize-none"
            />
            {errors.description && <p className="text-red-500 text-xs font-bold pl-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Base Price ($)</label>
              <input
                {...register('basePrice')}
                type="number"
                step="0.01"
                placeholder="180.00"
                className="w-full bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 transition-all"
              />
              {errors.basePrice && <p className="text-red-500 text-xs font-bold pl-1">{errors.basePrice.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Status</label>
              <select
                {...register('isActive', { setValueAs: (v) => v === 'true' })}
                className="w-full bg-[#1a1c3d]/60 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50 transition-all appearance-none"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
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
              className="flex-1 bg-white/5 text-slate-400 py-4 rounded-2xl font-black hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-dashboard-primary text-dashboard-bg py-4 rounded-2xl font-black shadow-xl shadow-dashboard-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
