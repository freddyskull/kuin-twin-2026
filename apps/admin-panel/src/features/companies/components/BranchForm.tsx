import React, { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { Branch } from '../../../stores/branches.store';

interface BranchFormProps {
  initialData?: Partial<Branch>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const BranchForm: React.FC<BranchFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-300 mb-2">Nombre de la Sucursal *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
            placeholder="Ej: Sucursal Centro"
          />
        </div>

        <div className="col-span-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isMain"
              checked={formData.isMain}
              onChange={handleChange}
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
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
            placeholder="Calle y número"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Ciudad *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Estado *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-300 mb-2">Código Postal *</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            required
            maxLength={5}
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-300 mb-2 text-primary flex items-center gap-2">
            <Phone className="h-4 w-4" /> Teléfono
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>

        <div>
          <label className="text-sm font-bold text-slate-300 mb-2 text-primary flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email de contacto
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[#0a0b1e]/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-dashboard-primary/50"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-bold text-slate-300 mb-2">Descripción / Notas</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
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
