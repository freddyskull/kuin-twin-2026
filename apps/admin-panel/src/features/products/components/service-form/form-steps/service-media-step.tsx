import React, { useRef, useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from 'ui-components';
import type { ServiceFormValues } from '../schema';
import { useAuthStore } from '../../../../../stores/auth.store';

export const ServiceMediaStep: React.FC = () => {
  const { watch, setValue, getValues } = useFormContext<ServiceFormValues>();
  const imageUrl = watch('imageUrl');
  const imageGallery = watch('imageGallery') || [];
  const imageGalleryFiles = watch('imageGalleryFiles') || [];

  const { user } = useAuthStore();
  const { toast } = useToast();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const featuredInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Sync featured image preview with file from form state
  const imageFile = watch('imageFile');
  useEffect(() => {
    // Robust check for File object
    const isFile = imageFile && typeof imageFile === 'object' && ('name' in imageFile || imageFile instanceof File);

    if (isFile) {
      const url = URL.createObjectURL(imageFile as File);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  // Sync gallery previews with files from form state
  useEffect(() => {
    if (imageGalleryFiles && imageGalleryFiles.length > 0) {
      const urls = imageGalleryFiles
        .filter(file => file && typeof file === 'object' && ('name' in file || file instanceof File))
        .map(file => URL.createObjectURL(file as File));

      setGalleryPreviews(urls);
      return () => {
        urls.forEach(url => URL.revokeObjectURL(url));
      };
    } else {
      setGalleryPreviews([]);
    }
  }, [imageGalleryFiles]);

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Error", description: "Imagen mayor a 5MB" });
      return;
    }

    setValue('imageFile', file, { shouldDirty: true, shouldValidate: true });
    if (featuredInputRef.current) featuredInputRef.current.value = '';
  };

  const handleGalleryFiles = (files: File[]) => {
    if (files.length === 0 || !user?.id) return;

    const validFiles = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast({ variant: "destructive", title: "Atención", description: "Algunas imágenes exceden los 5MB y fueron omitidas." });
    }

    const currentFiles = getValues('imageGalleryFiles') || [];
    setValue('imageGalleryFiles', [...currentFiles, ...validFiles], { shouldDirty: true, shouldValidate: true });
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleGalleryFiles(Array.from(e.target.files || []));
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleGalleryFiles(files);
  };

  const removeFeatured = () => {
    setValue('imageUrl', '', { shouldDirty: true });
    setValue('imageFile', undefined, { shouldDirty: true });
    setPreviewUrl(null);
  };

  const removeGalleryFile = (index: number) => {
    const newFiles = [...imageGalleryFiles];
    newFiles.splice(index, 1);
    setValue('imageGalleryFiles', newFiles, { shouldDirty: true });
  };

  const removeGalleryUrl = (url: string) => {
    const newUrls = imageGallery.filter(u => u !== url);
    setValue('imageGallery', newUrls, { shouldDirty: true });
  };

  const displayFeatured = previewUrl || (imageUrl ? (imageUrl.startsWith('http') || imageUrl.startsWith('blob:') ? imageUrl : `http://localhost:3001${imageUrl}`) : null);

  return (
    <motion.section
      key="step3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
      className="bg-accent/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 space-y-10"
    >
      <input type="file" ref={featuredInputRef} onChange={handleFeaturedChange} className="hidden" accept="image/*" />
      <input type="file" ref={galleryInputRef} onChange={handleGalleryChange} className="hidden" accept="image/*" multiple />

      {/* Featured Image Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-white tracking-tight">Imagen Destacada</h2>
        </div>

        {displayFeatured ? (
          <div className="relative group rounded-2xl overflow-hidden bg-[#0a0b1e]/40 border border-white/5 aspect-video max-w-2xl">
            <img src={displayFeatured} alt="Featured" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button type="button" onClick={removeFeatured} className="bg-red-500 p-3 rounded-xl text-white shadow-xl hover:scale-110 active:scale-95 transition-all">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ) : (
          <div onClick={() => featuredInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl h-48 max-w-2xl flex flex-col items-center justify-center gap-3 group hover:border-primary/40 transition-all cursor-pointer bg-[#0a0b1e]/20">
            <div className="h-12 w-12 rounded-xl bg-[#1a1c3d] flex items-center justify-center text-slate-600 group-hover:text-primary group-hover:scale-110 transition-all duration-300">
              <Plus className="h-5 w-5" />
            </div>
            <p className="text-slate-500 font-bold text-sm">Click para subir imagen destacada</p>
          </div>
        )}
      </div>

      {/* Gallery Section */}
      <div className="space-y-6 pt-10 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Galería de Imágenes</h2>
          </div>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all border border-white/5"
          >
            <Plus className="h-4 w-4" /> Añadir Imágenes
          </button>
        </div>

        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 rounded-2xl transition-all ${isDragging ? 'bg-blue-500/10 border-2 border-dashed border-blue-500/40 ring-4 ring-blue-500/5' : ''
            }`}
        >
          {/* Existentes (URLs) */}
          {imageGallery.map((url, idx) => (
            <div key={`url-${idx}`} className="relative group rounded-xl overflow-hidden bg-[#0a0b1e]/40 border border-white/5 aspect-square shadow-lg">
              <img src={url.startsWith('http') || url.startsWith('blob:') ? url : `http://localhost:3001${url}`} alt="Gallery item" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => removeGalleryUrl(url)} className="p-2 text-white bg-red-500 rounded-lg hover:scale-110 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Nuevas (Previews locales) */}
          {galleryPreviews.map((url, idx) => (
            <div key={`file-${idx}`} className="relative group rounded-xl overflow-hidden bg-[#0a0b1e]/40 border border-primary/30 aspect-square shadow-lg">
              <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
              <div className="absolute top-1.5 right-1.5 px-2 py-0.5 bg-primary/90 backdrop-blur-sm rounded text-[7px] font-black text-primary uppercase">Nuevo</div>
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => removeGalleryFile(idx)} className="p-2 text-white bg-red-500 rounded-lg hover:scale-110 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Selector / Dropzone Placeholder */}
          <div
            onClick={() => galleryInputRef.current?.click()}
            className={`border-2 border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2 group hover:border-primary/20 transition-all cursor-pointer bg-[#0a0b1e]/10 aspect-square ${isDragging ? 'border-blue-500 animate-pulse bg-blue-500/5' : ''
              }`}
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-700 group-hover:text-primary group-hover:bg-primary/10 transition-all">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] group-hover:text-primary transition-all text-center px-2">
              {isDragging ? 'Suelta aquí' : 'Añadir'}
            </span>
          </div>
        </div>

        {isDragging && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 py-4 bg-blue-500/5 border border-blue-500/20 rounded-xl"
          >
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
            <p className="text-blue-400 text-xs font-bold uppercase tracking-wider">Suelta las imágenes para añadirlas</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
