'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, getAbsoluteUrl } from '../lib/utils';

interface ServiceGalleryProps {
  mainImage: string | null;
  gallery: string[];
  title: string;
  ImageComponent?: any;
}

export const ServiceGallery: React.FC<ServiceGalleryProps> = ({
  mainImage,
  gallery,
  title,
  ImageComponent: Image = 'img'
}) => {
  // Combinar imagen principal con la galería, evitando duplicados
  const galleryItems = (gallery || []).filter(img => img !== mainImage);

  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...galleryItems
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl bg-[#0a0b1e] flex items-center justify-center">
        <span className="text-4xl text-slate-700 opacity-20">🛠️</span>
      </div>
    );
  }

  const currentImageUrl = getAbsoluteUrl(allImages[activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-3 w-full">
      {/* Main Image Viewer */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/5 shadow-2xl bg-[#0a0b1e] group">
        {currentImageUrl && (
          <Image
            src={currentImageUrl}
            alt={`${title} - Imagen ${activeIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            {...(Image !== 'img' ? { fill: true, unoptimized: true } : {})}
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Navigation Buttons (Only if more than 1 image) */}
        {allImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:border-primary active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:border-primary active:scale-90"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-xl px-2 py-1 rounded-full border border-white/10">
          <p className="text-[9px] font-black tracking-widest text-white/90 uppercase">
            {activeIndex + 1} <span className="text-white/40">/</span> {allImages.length}
          </p>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar snap-x no-scrollbar">
          {allImages.map((img, idx) => {
            const thumbUrl = getAbsoluteUrl(img);
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start",
                  activeIndex === idx
                    ? "border-primary ring-2 ring-primary/20 scale-95"
                    : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"
                )}
              >
                {thumbUrl && (
                  <Image
                    src={thumbUrl}
                    alt={`${title} miniatura ${idx + 1}`}
                    className="w-full h-full object-cover"
                    {...(Image !== 'img' ? { fill: true, unoptimized: true } : {})}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
