import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useServicesStore } from '../../stores/services.store';
import { useAuthStore } from '../../stores/auth.store';
import { ServiceWizardForm } from './components/service-form/ServiceWizardForm';
import type { ServiceFormValues } from './components/service-form/schema';

export const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { services, fetchMetadata, fetchServices, updateService } = useServicesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<ServiceFormValues>>({});

  useEffect(() => {
    fetchMetadata();
    fetchServices();
  }, [fetchMetadata, fetchServices]);

  useEffect(() => {
    if (services.length > 0 && id) {
      const service = services.find(s => s.id === id);
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
        setIsLoading(false);
      }
    }
  }, [id, services]);

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

      await updateService(id, payload);
      navigate('/services');
    } catch (error) {
      console.error('Failed to update service:', error);
    }
  };

  if (isLoading) {
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
