import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';

import { AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useToast, SmartSubmitButton, Button } from 'ui-components';

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
      imageGallery: [],
      imageGalleryFiles: [],
      ...initialValues
    }
  });

  const { trigger, handleSubmit, formState: { errors }, setValue, watch, reset } = methods;

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
          <Button
            type="button"
            onClick={handleCancel}
            variant="outline"
          >
            Cancelar
          </Button>
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
              <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${currentStep >= step.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                : 'bg-accent text-slate-600 border border-white/5 group-hover:border-primary/50 group-hover:text-primary'
                }`}>
                {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
              </div>
              <span className={`text-[9px] font-bold tracking-wider uppercase transition-colors ${currentStep >= step.id ? 'text-primary' : 'text-slate-600 group-hover:text-primary/70'
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
              <Button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
              >
                Atrás
              </Button>

              <div className="flex items-center gap-4">
                {isEditMode && currentStep < 5 && (
                  <SmartSubmitButton
                    loadingLabel="Actualizando..."
                  >
                    Actualizar Ahora
                  </SmartSubmitButton>
                )}

                {currentStep === 5 ? (
                  <SmartSubmitButton
                    loadingLabel="Procesando..."
                  >
                    {submitLabel}
                  </SmartSubmitButton>
                ) : (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="default"
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <ServicePreview currentStep={currentStep} isEditMode={isEditMode} />
        </form>
      </div>
    </FormProvider>
  );
};
