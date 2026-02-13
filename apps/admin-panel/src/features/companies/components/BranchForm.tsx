import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import type { Branch } from '../../../stores/branches.store';
import {
  CustomForm,
  FormInput,
  FormCheckbox,
  FormTextarea
} from 'ui-components';
import { z } from 'zod';

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

export const BranchForm: React.FC<BranchFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {

  const handleFormSubmit = async (data: BranchFormValues) => {
    const payload = { ...data };
    if (!payload.email) delete (payload as any).email;
    if (!payload.description) delete (payload as any).description;
    if (!payload.phone) delete (payload as any).phone;
    if (!payload.whatsapp) delete (payload as any).whatsapp;

    await onSubmit(payload);
  };

  const defaultValues: BranchFormValues = {
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
  };

  return (
    <CustomForm
      schema={branchFormSchema}
      onSubmit={handleFormSubmit}
      defaultValues={defaultValues}
      className="space-y-6"
    >
      {() => (
        <>
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2">
              <FormInput name="name" label="Nombre de la Sucursal" required placeholder="Ej: Sucursal Centro" />
            </div>

            <div className="col-span-2">
              <FormCheckbox name="isMain" label="Esta es la sucursal principal" />
            </div>

            <div className="col-span-2">
              <div className="text-sm font-bold text-dashboard-primary flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4" /> Ubicación Física
              </div>
              <FormInput name="address" label="Dirección" required placeholder="Calle y número" />
            </div>

            <FormInput name="city" label="Ciudad" required />
            <FormInput name="state" label="Estado" required />
            <FormInput name="zipCode" label="Código Postal" required maxLength={5} />

            <div className="col-span-1">
              <div className="text-sm font-bold text-dashboard-primary flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4" /> Teléfono
              </div>
              <FormInput name="phone" label="Teléfono" />
            </div>

            <div className="col-span-1">
              <div className="text-sm font-bold text-dashboard-primary flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4" /> Email
              </div>
              <FormInput name="email" label="Email de contacto" type="email" />
            </div>

            <div className="col-span-2">
              <FormTextarea name="description" label="Descripción / Notas" rows={2} />
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
        </>
      )}
    </CustomForm>
  );
};
