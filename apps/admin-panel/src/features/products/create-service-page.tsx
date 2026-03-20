import React from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { useNavigate } from 'react-router-dom';
import { useCreateService } from './services.hooks';
import { useServicesStore } from '../../stores/services.store';

import { useToast } from 'ui-components';
import { ServiceWizardForm } from './components/service-form/service-wizard-form';
import type { ServiceFormValues } from './components/service-form/schema';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const CreateServicePage: React.FC = () => {
  const createMutation = useCreateService();
  const { uploadMedia } = useServicesStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [uploadProgress, setUploadProgress] = useState<{
    active: boolean;
    percent: number;
    currentFile: string;
  }>({ active: false, percent: 0, currentFile: '' });

  const onSubmit = async (data: ServiceFormValues) => {
    if (!user?.id) return;

    try {
      let finalImageUrl = data.imageUrl;
      let finalImageGallery = [...(data.imageGallery || [])];

      const totalSteps = (data.imageFile ? 1 : 0) + (data.imageGalleryFiles?.length || 0);
      let completedSteps = 0;

      const updateGlobalProgress = (fileProgress: number) => {
        const globalBase = (completedSteps / (totalSteps || 1)) * 100;
        const incremental = (fileProgress / (totalSteps || 1));
        setUploadProgress(prev => ({ ...prev, percent: Math.round(globalBase + incremental) }));
      };

      setUploadProgress({ active: true, percent: 0, currentFile: 'Iniciando subida...' });

      // Upload main image first if a new one was selected
      if (data.imageFile) {
        setUploadProgress(prev => ({ ...prev, currentFile: 'Subiendo imagen principal...' }));
        const media = await uploadMedia(user.id, data.imageFile, updateGlobalProgress);
        finalImageUrl = media?.url || media?.path || (typeof media === 'string' ? media : finalImageUrl);
        completedSteps++;
      }

      // Upload gallery images
      if (data.imageGalleryFiles && data.imageGalleryFiles.length > 0) {
        for (let i = 0; i < data.imageGalleryFiles.length; i++) {
          const file = data.imageGalleryFiles[i];
          setUploadProgress(prev => ({ ...prev, currentFile: `Subiendo imagen galería ${i + 1}/${data.imageGalleryFiles.length}...` }));
          
          try {
            const media = await uploadMedia(user.id, file, updateGlobalProgress);
            const url = media?.url || media?.path || (typeof media === 'string' ? media : null);
            if (url) finalImageGallery.push(url);
            completedSteps++;
          } catch (err) {
            console.error('Failed to upload a gallery image:', err);
          }
        }
      }

      setUploadProgress(prev => ({ ...prev, percent: 100, currentFile: 'Finalizando...' }));

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


      await createMutation.mutateAsync(payload);
      setUploadProgress({ active: false, percent: 0, currentFile: '' });
      navigate('/servicios');
    } catch (error: any) {
      setUploadProgress({ active: false, percent: 0, currentFile: '' });
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
    <>
      <AnimatePresence>
        {uploadProgress.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0b1e]/80 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-md bg-card border border-white/10 p-8 rounded-[2.5rem] shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white tracking-tight">Subiendo Contenido</h3>
                  <p className="text-slate-400 text-xs font-medium truncate">{uploadProgress.currentFile}</p>
                </div>
                <span className="text-2xl font-black text-primary">{uploadProgress.percent}%</span>
              </div>

              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress.percent}%` }}
                  className="h-full bg-gradient-to-r from-primary to-orange-400 rounded-full shadow-[0_0_15px_rgba(245,192,106,0.4)]"
                />
              </div>

              <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                No cierres esta ventana hasta terminar
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ServiceWizardForm
        onSubmit={onSubmit}
        title="Crear Servicio"
        subtitle="Publica tu nueva oferta de servicio en el marketplace."
        submitLabel="Publicar Servicio"
      />
    </>
  );
};
