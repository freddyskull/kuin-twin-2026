import React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Image as ImageIcon, Lightbulb, Check, FileWarning } from 'lucide-react';
import type { ServiceFormValues } from './schema';
import { useServicesStore } from '../../../../stores/services.store';

interface ServicePreviewProps {
  currentStep: number;
  isEditMode?: boolean;
}

export const ServicePreview: React.FC<ServicePreviewProps> = ({ currentStep, isEditMode = false }) => {
  const { control, formState: { errors, isValid, isDirty } } = useFormContext<ServiceFormValues>();
  const watchedValues = useWatch({ control });
  const { categories, units } = useServicesStore();

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

  return (
    <div className="col-span-4 space-y-6 sticky top-24 self-start">
      <div className="space-y-4">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Vista Previa</h3>
        <div className="bg-[#0a0b1e] border border-white/5 rounded-3xl overflow-hidden group shadow-xl">
          <div className="h-56 bg-[#1a1c3d] relative">
            {displayImage ? (
              <img
                src={displayImage.startsWith('http') || displayImage.startsWith('blob:') ? displayImage : `http://localhost:3001${displayImage}`}
                className="w-full h-full object-cover"
                alt="Preview"
              />
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

            {((watchedValues.imageGallery?.length || 0) + (watchedValues.imageGalleryFiles?.length || 0)) > 0 && (
              <div className="flex items-center gap-1.5 pt-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-dashboard-primary animate-pulse" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  +{(watchedValues.imageGallery?.length || 0) + (watchedValues.imageGalleryFiles?.length || 0)} Fotos en Galería
                </span>
              </div>
            )}

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

      {/* Diagnóstico de Errores Mejorado en el Preview */}
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
                  <ul className="list-disc list-inside text-xs text-red-400 font-medium pt-1 space-y-1">
                    {Object.keys(errors).length === 0 ? (
                      <li>Revisando validaciones...</li>
                    ) : (
                      Object.keys(errors).map((key) => {
                        const errorObj = (errors as any)[key];
                        const errorMessage = errorObj?.message || (errorObj?.root?.message) || "Error de validación";

                        // Mapeo amistoso
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
                      })
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isValid && !isDirty && isEditMode && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="text-sm font-bold text-yellow-500">Sin cambios detectados</h4>
                  <p className="text-xs text-yellow-400/80">Realiza alguna modificación para habilitar la actualización.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
