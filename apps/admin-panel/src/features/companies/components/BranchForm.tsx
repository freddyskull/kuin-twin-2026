import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { Branch } from '../../../stores/branches.store';

const branchFormSchema = z.object({
  name: z.string().min(1, 'El nombre de la sucursal es obligatorio'),
  isMain: z.boolean().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  address: z.string().min(1, 'La dirección es obligatoria'),
  city: z.string().min(1, 'La ciudad es obligatoria'),
  state: z.string().min(1, 'El estado es obligatorio'),
  zipCode: z.string().min(5, 'El código postal debe tener 5 dígitos').max(5),
  country: z.string().min(1, 'El país es obligatorio'),
});

type BranchFormValues = z.infer<typeof branchFormSchema>;

interface BranchFormProps {
  initialData?: Partial<Branch>;
  onSubmit: (data: BranchFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const BranchForm: React.FC<BranchFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      isMain: initialData?.isMain || false,
      description: initialData?.description || '',
      phone: initialData?.phone || '',
      whatsapp: initialData?.whatsapp || '',
      email: initialData?.email || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zipCode: initialData?.zipCode || '',
      country: initialData?.country || 'México',
    }
  });

  const handleFormSubmit = async (data: BranchFormValues) => {
    const payload = { ...data };
    if (payload.email === '') delete payload.email;
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-300 mb-2">Nombre de la Sucursal *</label>
          <input
            {...register('name')}
            className={`w-full bg-[#0a0b1e]/60 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
            placeholder="Ej: Sucursal Centro"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              {...register('isMain')}
              type="checkbox"
              className="w-5 h-5 rounded bg-[#0a0b1e]/60 border border-white/10 text-dashboard-primary focus:ring-2 focus:ring-dashboard-primary/50"
            />
            <span className="text-sm font-bold text-slate-300">Esta es la sucursal principal</span>
          </label>
        </div>

        <div className="col-span-2">
          <label className="text-sm font-bold text-slate-300 mb-2 text-primary flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Ubicación Física *
          </label>
          <input
            {...register('address')}
            className={`w-full bg-[#0a0b1e]/60 border ${errors.address ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
            placeholder="Calle y número"
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Ciudad *</label>
          <input
            {...register('city')}
            className={`w-full bg-[#0a0b1e]/60 border ${errors.city ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Estado *</label>
          <input
            {...register('state')}
            className={`w-full bg-[#0a0b1e]/60 border ${errors.state ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
          />
          {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Código Postal *</label>
          <input
            {...register('zipCode')}
            maxLength={5}
            className={`w-full bg-[#0a0b1e]/60 border ${errors.zipCode ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
          />
          {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
        </div>

        <div>
          <label className="text-sm font-bold text-slate-300 mb-2 text-primary flex items-center gap-2">
            <Phone className="h-4 w-4" /> Teléfono
          </label>
          <input
            {...register('phone')}
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-300 mb-2 text-primary flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email de contacto
          </label>
          <input
            {...register('email')}
            type="email"
            className={`w-full bg-[#0a0b1e]/60 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-300 mb-2">Descripción / Notas</label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>
      </div>

      <div className="flex gap-4 justify-end pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 rounded-xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 rounded-xl bg-dashboard-primary text-dashboard-bg font-black shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar Sucursal' : 'Crear Sucursal'}
        </button>
      </div>
    </form>
  );
};
