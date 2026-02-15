import React from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { useCreateService } from './services.hooks';
import { useServicesStore } from '../../stores/services.store';

import { useToast } from 'ui-components';
import { ServiceWizardForm } from './components/service-form/service-wizard-form';
import type { ServiceFormValues } from './components/service-form/schema';

export const CreateServicePage: React.FC = () => {
  const createMutation = useCreateService();
  const { uploadMedia } = useServicesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id) return;

    try {
      let finalImageUrl = data.imageUrl;

      // Upload image first if a new one was selected
      if (data.imageFile) {
        toast({
          title: "Subiendo imagen...",
          description: "Por favor espera un momento.",
        });
        const media = await uploadMedia(user.id, data.imageFile);
        finalImageUrl = media?.url || media?.path || (typeof media === 'string' ? media : finalImageUrl);
      }

      const payload = {
        vendorId: user.id,
        categoryId: data.categoryId,
        unitId: data.unitId,
        title: data.title,
        slug: data.slug,
        tags: data.tags,
        description: data.description,
        basePrice: data.basePrice,
        showPrice: data.showPrice,
        imageUrl: finalImageUrl,
        metadata: data.metadata,
        dynamicAttributes: {
          ...(data.dynamicAttributes ? JSON.parse(data.dynamicAttributes) : {}),
          ubicacion: data.address,
          latitud: data.latitude,
          longitud: data.longitude
        },
        workSchedule: data.workSchedule,
        slots: data.slots || [],
        companyId: data.companyId,
        branchIds: data.branchIds
      };


      await createMutation.mutateAsync(payload);
      navigate('/servicios');
    } catch (error: any) {
      console.error('Failed to create service - Full Error:', error);

      let errorMessage = "Ocurrió un error inesperado.";

      if (error.response?.data?.message) {
        const msg = error.response.data.message;
        if (Array.isArray(msg)) {
          // Si es un array de strings, unirlos
          if (typeof msg[0] === 'string') {
            errorMessage = msg.join(', ');
          }
          // Si es un array de objetos (validación detallada), extraer mensajes
          else if (typeof msg[0] === 'object') {
            errorMessage = msg.map((err: any) =>
              err.message || Object.values(err.constraints || {}).join(', ')
            ).join('. ');
          }
        } else if (typeof msg === 'object') {
          errorMessage = JSON.stringify(msg);
        } else {
          errorMessage = String(msg);
        }
      }

      toast({
        variant: "destructive",
        title: "Error al crear servicio",
        description: errorMessage,
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
