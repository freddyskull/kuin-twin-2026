import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from 'ui-components';

import { serviceSchema } from './schema';
import type { ServiceFormValues } from './schema';
import { ServiceInfoStep } from './form-steps/service-info-step';
import { ServicePriceStep } from './form-steps/service-price-step';
import { ServiceMediaStep } from './form-steps/service-media-step';
import { ServiceAttributesStep } from './form-steps/service-attributes-step';
import { ServiceAvailabilityStep } from './form-steps/service-availability-step';
import { ServicePreview } from './service-preview';
import { useCategories, useServiceUnits } from '../../services.hooks';

interface ServiceWizardFormProps {
  initialValues?: Partial<ServiceFormValues>;
  onSubmit: (data: ServiceFormValues) => Promise<void>;
  title: string;
  subtitle: string;
  submitLabel: string;
  onCancel?: () => void;
  isEditMode?: boolean;
}

const steps = [
  { id: 1, label: 'INFO' },
  { id: 2, label: 'PRECIO' },
  { id: 3, label: 'MEDIA' },
  { id: 4, label: 'ATRIBUTOS' },
  { id: 5, label: 'HORARIOS' },
];

export const ServiceWizardForm: React.FC<ServiceWizardFormProps> = ({
  initialValues,
  onSubmit,
  title,
  subtitle,
  submitLabel,
  onCancel,
  isEditMode = false
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { data: categories = [] } = useCategories();
  const { data: units = [] } = useServiceUnits();
  const navigate = useNavigate();
  const { toast } = useToast();

  const methods = useForm<ServiceFormValues>({
    // @ts-expect-error - Type incompatibility between zod 3.25+ and @hookform/resolvers
    resolver: zodResolver(serviceSchema),
    mode: 'onChange',
    defaultValues: {
      categoryId: '',
      unitId: '',
      basePrice: initialValues?.basePrice || 0,
      showPrice: initialValues?.showPrice ?? true,
      address: initialValues?.address || '',
      latitude: initialValues?.latitude || 0,
      longitude: initialValues?.longitude || 0,
      slug: '',
      tags: [],
      imageUrl: '',
      metadata: initialValues?.metadata || [
        { key: 'Garantía', value: '12 meses' },
        { key: 'Tiempo de respuesta', value: '24 horas' }
      ],
      dynamicAttributes: initialValues?.dynamicAttributes || JSON.stringify({
        "Garantía": "12 meses",
        "Tiempo de respuesta": "24 horas"
      }, null, 2),
      workSchedule: undefined,
      slots: [],
      companyId: '',
      branchIds: [],
      ...initialValues
    }
  });

  const { trigger, handleSubmit, formState: { isSubmitting, errors, isValid, isDirty }, setValue, watch, reset } = methods;

  // Reset form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const watchedCategoryId = watch('categoryId');
  const watchedUnitId = watch('unitId');

  // Set default category and unit if needed
  useEffect(() => {
    if (!isEditMode) {
      if (categories.length > 0 && !watchedCategoryId) {
        setValue('categoryId', categories[0].id);
      }
      if (units.length > 0 && !watchedUnitId) {
        setValue('unitId', units[0].id);
      }
    }
  }, [categories, units, isEditMode, setValue, watchedCategoryId, watchedUnitId]);

  // Force validation when reaching last step to ensure errors are visible
  useEffect(() => {
    if (currentStep === 5) {
      trigger();
    }
  }, [currentStep, trigger]);

  const handleNext = async (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent form submission
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['title', 'description', 'categoryId', 'companyId'];
    if (currentStep === 2) fieldsToValidate = ['basePrice', 'unitId'];
    if (currentStep === 4) fieldsToValidate = ['metadata', 'dynamicAttributes'];

    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (!isStepValid) {
      // Show error toast with specific field errors
      const stepErrors = fieldsToValidate.map(field => errors[field as keyof typeof errors]).filter(Boolean);
      if (stepErrors.length > 0) {
        toast({
          variant: "destructive",
          title: "Revisa los campos",
          description: "Hay errores en el formulario que debes corregir antes de continuar.",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/servicios');
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="max-w-[1600px] mx-auto space-y-10 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">{title}</h1>
            <p className="text-slate-400 font-medium">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="bg-white/5 border border-white/10 text-slate-400 px-6 py-2.5 rounded-xl font-bold hover:bg-white/10 transition-all text-sm"
          >
            Cancelar
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between max-w-2xl mx-auto py-4 relative">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className="relative z-10 flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step.id
                ? 'bg-dashboard-primary text-dashboard-bg shadow-lg shadow-dashboard-primary/20'
                : 'bg-[#11122d] text-slate-600 border border-white/5 group-hover:border-dashboard-primary/50 group-hover:text-dashboard-primary'
                }`}>
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <span className={`text-[9px] font-bold tracking-wider uppercase transition-colors ${currentStep >= step.id ? 'text-dashboard-primary' : 'text-slate-600 group-hover:text-dashboard-primary/70'
                }`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-12 gap-8">
          <div className="col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && <ServiceInfoStep />}
              {currentStep === 2 && <ServicePriceStep />}
              {currentStep === 3 && <ServiceMediaStep />}
              {currentStep === 4 && <ServiceAttributesStep />}
              {currentStep === 5 && <ServiceAvailabilityStep />}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="px-8 py-3 rounded-xl border border-white/5 text-slate-500 font-bold uppercase text-xs hover:bg-white/5 transition-all disabled:opacity-0"
              >
                Atrás
              </button>

              <div className="flex items-center gap-4">
                {isEditMode && currentStep < 5 && (
                  <button
                    type="submit"
                    disabled={isSubmitting || !isValid || !isDirty}
                    className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Actualizar Ahora
                  </button>
                )}

                <button
                  type={currentStep === 5 ? "submit" : "button"}
                  onClick={currentStep < 5 ? handleNext : undefined}
                  // En modo Create, permitimos enviar aunque no sea dirty (por valores por defecto)
                  // En modo Edit, exigimos dirty
                  disabled={isSubmitting || (currentStep === 5 && (!isValid || (isEditMode && !isDirty)))}
                  className="flex items-center gap-3 bg-dashboard-primary text-dashboard-bg px-8 py-3 rounded-xl font-bold shadow-lg shadow-dashboard-primary/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 5 ? (isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : submitLabel) : 'Siguiente'}
                  {currentStep < 5 && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Diagnóstico de Errores Mejorado */}
            {currentStep === 5 && (
              <div className="space-y-4">
                {/* Caso 1: Hay errores de validación */}
                {(!isValid) && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 animate-in slide-in-from-bottom-2">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-red-500/20 rounded-lg">
                        <Loader2 className="h-4 w-4 text-red-500 animate-pulse" />
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

                {/* Caso 2: Formulario válido pero sin cambios (solo para Edit Mode) */}
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

          <ServicePreview currentStep={currentStep} />
        </form>
      </div>
    </FormProvider>
  );
};
