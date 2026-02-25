'use client';

import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Lightbulb, Check, FileWarning } from 'lucide-react';
import type { ServiceFormValues } from './schema';
import { useServicesStore } from '../../../../stores/services.store';
import { ServiceCard } from 'ui-components';

interface ServicePreviewProps {
  currentStep: number;
  isEditMode?: boolean;
}

export const ServicePreview: React.FC<ServicePreviewProps> = ({ currentStep, isEditMode = false }) => {
  const { control, formState: { errors, isValid, isDirty } } = useFormContext<ServiceFormValues>();
  const watchedValues = useWatch({ control });
  const { categories } = useServicesStore();

  const [localPreview, setLocalPreview] = React.useState<string | null>(null);

  React.useEffect(() => {
    const file = watchedValues.imageFile;
    const isFile = file && typeof file === 'object' && ('name' in file || file instanceof File);

    if (isFile) {
      const url = URL.createObjectURL(file as File);
      setLocalPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLocalPreview(null);
    }
  }, [watchedValues.imageFile]);

  const displayImage = localPreview || watchedValues.imageUrl;
  const category = categories.find(c => c.id === watchedValues.categoryId);

  // Mapeo de valores para el ServiceCard compartido
  // Usamos el mismo diseño que en la página principal (ServiceCard)
  const previewData = {
    title: watchedValues.title,
    description: watchedValues.description,
    basePrice: watchedValues.basePrice,
    showPrice: watchedValues.showPrice,
    imageUrl: displayImage,
    category: category ? { name: category.name } : undefined,
    company: watchedValues.companyId ? { businessName: 'Tu Empresa' } : undefined,
    starsRate: '5.0',
    reviewsCount: 0,
    tags: watchedValues.tags,
    slug: 'preview'
  };

  return (
    <div className="col-span-4 space-y-6 sticky top-24 self-start">
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Vista Previa</h3>
        <div className="w-full ml-0">
          <ServiceCard service={previewData as any} />
        </div>
      </div>

      <div className="bg-[#1a1c3d]/20 border border-white/5 rounded-2xl p-4 flex gap-3">
        <Lightbulb className="h-4 w-4 text-dashboard-primary shrink-0" />
        <p className="text-slate-400 text-[10px] font-medium leading-relaxed">
          {currentStep === 1 && "Los títulos claros atraen más miradas."}
          {currentStep === 2 && "El precio es decisivo para el cliente."}
          {currentStep === 3 && "La imagen principal es tu carta de presentación."}
          {currentStep >= 4 && "Los detalles y tags ayudan al posicionamiento."}
        </p>
      </div>

      {/* Diagnóstico de Errores */}
      {(Object.keys(errors).length > 0 || (isValid && !isDirty && isEditMode && currentStep === 5)) && (
        <div className="space-y-4">
          {(!isValid) && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <FileWarning className="h-4 w-4 text-red-500 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-red-500">Atención: Faltan datos</h4>
                  <ul className="list-disc list-inside text-[10px] text-red-400 font-medium pt-1 space-y-1">
                    {Object.keys(errors).map((key) => {
                      const errorObj = (errors as any)[key];
                      const errorMessage = errorObj?.message || (errorObj?.root?.message) || "Error de validación";
                      const fieldName = {
                        basePrice: 'Precio Base',
                        unitId: 'Unidad de Medida',
                        title: 'Título',
                        categoryId: 'Categoría',
                        companyId: 'Empresa',
                        description: 'Descripción',
                        metadata: 'Atributos'
                      }[key] || key;

                      return (
                        <li key={key}>
                          <span className="font-bold capitalize text-red-300">{fieldName}:</span> {errorMessage}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isValid && !isDirty && isEditMode && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 text-yellow-500" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-500 text-xs">Sin cambios detectados</h4>
                  <p className="text-[10px] text-yellow-400/80">Modifica algo para habilitar el guardado.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
