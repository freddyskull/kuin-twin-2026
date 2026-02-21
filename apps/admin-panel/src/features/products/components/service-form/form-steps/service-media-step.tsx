import React, { useRef, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from 'ui-components';
import type { ServiceFormValues } from '../schema';
import { useAuthStore } from '../../../../../stores/auth.store';

export const ServiceMediaStep: React.FC = () => {
  const { watch, setValue } = useFormContext<ServiceFormValues>();
  const imageUrl = watch('imageUrl');

  const { user } = useAuthStore();
  const { toast } = useToast();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


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
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Create a local preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setValue('imageFile', file, { shouldDirty: true, shouldTouch: true, shouldValidate: true });

    // Reset the input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setValue('imageUrl', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setValue('imageFile', undefined, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const displayImage = previewUrl || (imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `http://localhost:3001${imageUrl}`) : null);


  return (
    <motion.section
      key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-accent/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-8"
    >
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

      <div className="flex items-center gap-3">
        <ImageIcon className="h-5 w-5 text-dashboard-primary" />
        <h2 className="text-xl font-bold text-white tracking-tight">Multimedia</h2>
      </div>

      {displayImage ? (
        <div className="relative group rounded-2xl overflow-hidden bg-[#0a0b1e]/40 border border-white/5 aspect-video">
          <img src={displayImage} alt="Service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={removeImage} className="bg-red-500 p-3 rounded-xl text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl h-64 flex flex-col items-center justify-center gap-3 group hover:border-dashboard-primary/40 transition-all cursor-pointer bg-[#0a0b1e]/20">
          <div className="h-16 w-16 rounded-2xl bg-[#1a1c3d] flex items-center justify-center text-slate-600 group-hover:text-dashboard-primary group-hover:scale-110 transition-all duration-300">
            <Plus className="h-6 w-6" />
          </div>
          <p className="text-slate-500 font-bold text-sm">
            Click para subir imagen
          </p>
          <p className="text-slate-600 text-xs">
            Tamaño máximo: 5MB
          </p>
        </div>
      )}
    </motion.section>
  );
};
