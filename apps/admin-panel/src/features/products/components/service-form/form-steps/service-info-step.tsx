import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label, FormInput, FormTextarea, FormChips } from 'ui-components';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';
import { CategorySelector } from '../category-selector';
import { CompanySelector } from '../company-selector';

export const ServiceInfoStep: React.FC = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<ServiceFormValues>();
  const { fetchMetadata } = useServicesStore();

  const slugify = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  React.useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  // Sync title with slug
  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'title') {
        setValue('slug', slugify(value.title || ''), { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  return (
    <motion.section
      key="step1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-card backdrop-blur-2xl border border-border rounded-[2rem] p-8 space-y-8"
    >
      <div className="flex items-center gap-3">
        <Settings className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Detalles Básicos</h2>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <FormInput
            name="title"
            label="Título"
            required
            placeholder="ej. Limpieza a Vapor Master"
          />
          <FormInput
            name="slug"
            label="Slug (URL)"
            placeholder="ej. limpieza-vapor-master"
          />
        </div>

        <div className="space-y-2">
          <FormChips
            name="tags"
            label="Etiquetas (Tags)"
            placeholder="Escribe una etiqueta y presiona Enter..."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">Categoría</Label>
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

        <FormTextarea
          name="description"
          label="Descripción"
          required
          rows={5}
          placeholder="Describe tu servicio..."
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between pl-1">
            <Label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Empresas y Sucursales Asociadas</Label>
            <span className="text-[10px] font-medium text-slate-500 italic">(Opcional)</span>
          </div>
          <Controller
            name="companyId"
            control={control}
            render={({ field: companyField }) => (
              <Controller
                name="branchIds"
                control={control}
                render={({ field: branchField }) => (
                  <CompanySelector
                    selectedCompanyId={companyField.value}
                    onCompanyChange={companyField.onChange}
                    selectedBranchIds={branchField.value || []}
                    onBranchChange={branchField.onChange}
                    error={errors.companyId?.message}
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
