import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { useService, useUpdateService } from './services.hooks';
import { useServicesStore } from '../../stores/services.store';
import { useToast } from 'ui-components';
import { ServiceWizardForm } from './components/service-form/service-wizard-form';
import type { ServiceFormValues } from './components/service-form/schema';

export const EditServicePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: service, isLoading: isLoadingService } = useService(id!);
  const updateMutation = useUpdateService();
  const { uploadMedia } = useServicesStore();
  const { user } = useAuthStore();

  const navigate = useNavigate();
  const { toast } = useToast();

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
        slug: service.slug || '',
        tags: service.tags || [],
        description: service.description || '',
        basePrice: Number(service.basePrice),
        showPrice: service.showPrice,
        categoryId: service.categoryId,
        unitId: service.unitId,
        imageUrl: service.imageUrl || '',
        imageGallery: service.imageGallery || [],
        metadata: metadata,
        dynamicAttributes: service.dynamicAttributes ? JSON.stringify(service.dynamicAttributes, null, 2) : '',
        address: (service.dynamicAttributes as any)?.ubicacion || '',
        latitude: (service.dynamicAttributes as any)?.latitud || 0,
        longitude: (service.dynamicAttributes as any)?.longitud || 0,
        workSchedule: service.workSchedule as any || undefined,
        slots: loadedSlots,
        faqs: service.faqs || [],
        companyId: service.companyId || ''
      });
    }
  }, [service]);

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id || !id) return;

    try {
      let finalImageUrl = data.imageUrl;
      let finalImageGallery = [...(data.imageGallery || [])];

      // Upload main image first if a new one was selected
      if (data.imageFile) {
        toast({ title: "Actualizando imagen principal...", description: "Por favor espera." });
        const media = await uploadMedia(user.id, data.imageFile);
        finalImageUrl = media?.url || media?.path || (typeof media === 'string' ? media : finalImageUrl);
      }

      // Upload new gallery images
      if (data.imageGalleryFiles && data.imageGalleryFiles.length > 0) {
        toast({ title: `Subiendo ${data.imageGalleryFiles.length} nuevas imágenes a la galería...`, description: "Por favor espera." });

        for (const file of data.imageGalleryFiles) {
          try {
            const media = await uploadMedia(user.id, file);
            const url = media?.url || media?.path || (typeof media === 'string' ? media : null);
            if (url) finalImageGallery.push(url);
          } catch (err) {
            console.error('Failed to upload gallery image:', err);
          }
        }
      }

      const payload = {
        categoryId: data.categoryId,
        unitId: data.unitId,
        title: data.title,
        slug: data.slug,
        tags: data.tags,
        description: data.description,
        basePrice: data.basePrice,
        showPrice: data.showPrice,
        imageUrl: finalImageUrl,
        imageGallery: finalImageGallery,
        metadata: data.metadata,
        dynamicAttributes: data.dynamicAttributes ? JSON.parse(data.dynamicAttributes) : {},
        workSchedule: data.workSchedule,
        slots: data.slots || [],
        faqs: data.faqs || [],
        companyId: data.companyId,
        branchIds: data.branchIds,
        latitude: data.latitude,
        longitude: data.longitude,
        address: data.address
      };

      await updateMutation.mutateAsync({ id, data: payload });
      navigate('/servicios');
    } catch (error: any) {
      console.error('Failed to update service:', error);
      toast({
        variant: "destructive",
        title: "Error al actualizar servicio",
        description: error.response?.data?.message || "Ocurrió un error inesperado.",
      });
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
      onCancel={() => navigate('/servicios')}
    />
  );
};
