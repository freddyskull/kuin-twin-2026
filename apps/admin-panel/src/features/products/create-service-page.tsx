import React from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { useCreateService } from './services.hooks';

import { useToast } from 'ui-components';
import { ServiceWizardForm } from './components/service-form/service-wizard-form';
import type { ServiceFormValues } from './components/service-form/schema';

export const CreateServicePage: React.FC = () => {
  const createMutation = useCreateService();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id) return;

    try {
      const payload = {
        vendorId: user.id,
        categoryId: data.categoryId,
        unitId: data.unitId,
        title: data.title,
        slug: data.slug,
        tags: data.tags,
        description: data.description,
        basePrice: data.basePrice,
        imageUrl: data.imageUrl,
        metadata: data.metadata,
        dynamicAttributes: data.dynamicAttributes ? JSON.parse(data.dynamicAttributes) : {},
        workSchedule: data.workSchedule,
        slots: data.slots || [],
        companyIds: data.companyIds
      };

      await createMutation.mutateAsync(payload);
      navigate('/services');
    } catch (error: any) {
      console.error('Failed to create service:', error);
      toast({
        variant: "destructive",
        title: "Error al crear servicio",
        description: error.response?.data?.message || "Ocurrió un error inesperado.",
      });
    }
  };

  return (
    <ServiceWizardForm
      onSubmit={onSubmit}
      title="Crear Servicio"
      subtitle="Publica tu nueva oferta de servicio en el marketplace."
      submitLabel="Publicar Servicio"
    />
  );
};
