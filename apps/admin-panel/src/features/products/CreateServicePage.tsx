import React from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { useCreateService } from './services.hooks';

import { ServiceWizardForm } from './components/service-form/ServiceWizardForm';
import type { ServiceFormValues } from './components/service-form/schema';

export const CreateServicePage: React.FC = () => {
  const createMutation = useCreateService();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id) return;

    try {
      const payload = {
        vendorId: user.id,
        categoryId: data.categoryId,
        unitId: data.unitId,
        title: data.title,
        description: data.description,
        basePrice: data.basePrice,
        imageUrl: data.imageUrl,
        metadata: data.metadata,
        dynamicAttributes: data.dynamicAttributes ? JSON.parse(data.dynamicAttributes) : {},
        workSchedule: data.workSchedule,
        slots: data.slots || []
      };

      await createMutation.mutateAsync(payload);
      navigate('/services');
    } catch (error) {
      console.error('Failed to create service:', error);
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
