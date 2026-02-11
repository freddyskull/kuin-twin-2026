import React from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useServicesStore } from '../../stores/services.store';
import { useNavigate } from '@tanstack/react-router';
import { ServiceWizardForm } from './components/service-form/ServiceWizardForm';
import type { ServiceFormValues } from './components/service-form/schema';

export const CreateServicePage: React.FC = () => {
  const { createService } = useServicesStore();
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

      await createService(payload);
      navigate({ to: '/services' });
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
