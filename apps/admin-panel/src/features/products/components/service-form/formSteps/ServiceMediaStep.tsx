import React, { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon, Trash2, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ServiceFormValues } from '../schema';
import { useServicesStore } from '../../../../../stores/services.store';
import { useAuthStore } from '../../../../../stores/auth.store';

export const ServiceMediaStep: React.FC = () => {
  const { watch, setValue } = useFormContext<ServiceFormValues>();
  const imageUrl = watch('imageUrl');

  const { uploadMedia } = useServicesStore();
  const { user } = useAuthStore();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    try {
      const media = await uploadMedia(user.id, file);
      setValue('imageUrl', media.url);
    } catch (error) {
      console.error('Failed to upload image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setValue('imageUrl', '');
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
        </div>
      )}
    </motion.section>
  );
};
