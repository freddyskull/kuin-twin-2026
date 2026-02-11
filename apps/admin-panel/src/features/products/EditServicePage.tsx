import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useService, useUpdateService } from './services.hooks';
import { ServiceWizardForm } from './components/service-form/ServiceWizardForm';
import type { ServiceFormValues } from './components/service-form/schema';

export const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading: isLoadingService } = useService(id!);
  const updateMutation = useUpdateService();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState<Partial<ServiceFormValues>>({});

  useEffect(() => {
    if (service) {
      // Transform slots for the form
      const daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const loadedSlots = service.slots && service.slots.length > 0
        ? service.slots.map((slot: any) => ({
          day: daysMap[new Date(slot.startTime).getDay()],
          startTime: new Date(slot.startTime).toTimeString().slice(0, 5),
          endTime: new Date(slot.endTime).toTimeString().slice(0, 5),
          isRecurring: slot.isRecurring || false
        }))
        : [];

      // Populate metadata from dynamicAttributes if metadata is empty or missing
      let metadata = service.metadata || [];
      if (metadata.length === 0 && service.dynamicAttributes) {
        try {
          const attributes = typeof service.dynamicAttributes === 'string'
            ? JSON.parse(service.dynamicAttributes)
            : service.dynamicAttributes;

          metadata = Object.entries(attributes).map(([key, value]) => ({
            key,
            value: String(value)
          }));
        } catch (e) {
          console.error('Failed to parse dynamicAttributes for metadata:', e);
        }
      }

      setInitialValues({
        title: service.title,
        description: service.description || '',
        basePrice: Number(service.basePrice),
        categoryId: service.categoryId,
        unitId: service.unitId,
        imageUrl: service.imageUrl || '',
        metadata: metadata,
        dynamicAttributes: service.dynamicAttributes ? JSON.stringify(service.dynamicAttributes, null, 2) : '',
        workSchedule: service.workSchedule as any || undefined,
        slots: loadedSlots
      });
    }
  }, [service]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id || !id) return;

    try {
      const payload = {
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

      await updateMutation.mutateAsync({ id, data: payload });
      navigate('/services');
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  if (isLoadingService) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-dashboard-primary" />
      </div>
    );
  }

  return (
    <ServiceWizardForm
      initialValues={initialValues}
      onSubmit={onSubmit}
      title="Editar Servicio"
      subtitle="Actualiza los detalles de tu oferta de servicio."
      submitLabel="Actualizar Servicio"
      isEditMode={true}
      onCancel={() => navigate('/services')}
    />
  );
};
