import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon, Trash2, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from 'ui-components';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';
import { useAuthStore } from '../../../../../stores/auth.store';

export const ServiceMediaStep: React.FC = () => {
  const { watch, setValue } = useFormContext<ServiceFormValues>();
  const imageUrl = watch('imageUrl');

  const { uploadMedia } = useServicesStore();
  const { user } = useAuthStore();
  const { toast } = useToast();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "Imagen demasiado grande",
        description: `La imagen pesa ${(file.size / 1024 / 1024).toFixed(2)}MB. El tamaño máximo permitido es 5MB.`,
      });
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setIsUploading(true);
    try {
      const media = await uploadMedia(user.id, file);
      // Handle different response formats (object with url/path or direct string)
      const url = media?.url || media?.path || (typeof media === 'string' ? media : undefined);

      if (url) {
        setValue('imageUrl', url, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        toast({
          variant: "default",
          title: "Imagen subida",
          description: "La imagen se ha subido correctamente.",
        });
      } else {
        throw new Error("Formato de respuesta de imagen inválido");
      }
    } catch (error: any) {
      console.error('Failed to upload image:', error);

      // Check if it's a 422 error (file too large or validation error)
      if (error?.response?.status === 422) {
        const errorMessage = error?.response?.data?.message || '';

        // Check if the error is related to file size
        if (errorMessage.toLowerCase().includes('size') || errorMessage.toLowerCase().includes('large') || errorMessage.toLowerCase().includes('tamaño')) {
          toast({
            variant: "destructive",
            title: "Imagen demasiado grande",
            description: "La imagen que intentas subir pesa demasiado. Por favor, usa una imagen más pequeña (máximo 5MB).",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error al procesar la imagen",
            description: errorMessage || "No se pudo procesar la imagen. Verifica que sea un formato válido.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Error al subir imagen",
          description: "Hubo un problema al subir la imagen. Inténtalo de nuevo.",
        });
      }
    } finally {
      setIsUploading(false);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = () => {
    setValue('imageUrl', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <motion.section
      key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-[#1a1c3d]/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <div className="flex items-center gap-3">
        <ImageIcon className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Multimedia</h2>
      </div>

      {imageUrl ? (
        <div className="relative group rounded-2xl overflow-hidden bg-[#0a0b1e]/40 border border-white/5 aspect-video">
          <img src={imageUrl.startsWith('http') ? imageUrl : `http://localhost:3001${imageUrl}`} alt="Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={removeImage} className="bg-red-500 p-3 rounded-xl text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center gap-3 group hover:border-dashboard-primary/40 transition-all cursor-pointer bg-[#0a0b1e]/20">
          <div className="h-16 w-16 rounded-2xl bg-[#1a1c3d] flex items-center justify-center text-slate-600 group-hover:text-dashboard-primary group-hover:scale-110 transition-all duration-300">
            {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-dashboard-primary" /> : <Plus className="h-6 w-6" />}
          </div>
          <p className="text-slate-500 font-bold text-sm">
            {isUploading ? 'Subiendo...' : 'Click para subir imagen'}
          </p>
          {!isUploading && (
            <p className="text-slate-600 text-xs">
              Tamaño máximo: 5MB
            </p>
          )}
        </div>
      )}
    </motion.section>
  );
};
