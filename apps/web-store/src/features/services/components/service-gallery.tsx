'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getAbsoluteUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ServiceGalleryProps {
  mainImage: string | null;
  gallery: string[];
  title: string;
}

export const ServiceGallery: React.FC<ServiceGalleryProps> = ({ mainImage, gallery, title }) => {
  // Combinar imagen principal con la galería, evitando duplicados
  const galleryItems = (gallery || []).filter(img => img !== mainImage);

  const allImages = [
    ...(mainImage ? [mainImage] : []),
    ...galleryItems
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-muted flex items-center justify-center">
        <span className="text-6xl text-muted-foreground opacity-20">🛠️</span>
      </div>
    );
  }

  const currentImage = getAbsoluteUrl(allImages[activeIndex]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Main Image Viewer */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl bg-[#0a0b1e] group">
        {currentImage && (
          <Image
            src={currentImage}
            alt={`${title} - Imagen ${activeIndex + 1}`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
            unoptimized // Para imágenes de local API
          />
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Navigation Buttons (Only if more than 1 image) */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:border-primary active:scale-90"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:border-primary active:scale-90"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10">
          <p className="text-[10px] font-black tracking-widest text-white/90 uppercase">
            {activeIndex + 1} <span className="text-white/40">/</span> {allImages.length}
          </p>
        </div>
      </div>

      {/* Thumbnails Strip */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar snap-x">
          {allImages.map((img, idx) => {
            const thumbUrl = getAbsoluteUrl(img);
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "relative flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 snap-start",
                  activeIndex === idx
                    ? "border-primary ring-4 ring-primary/20 scale-95"
                    : "border-white/5 opacity-50 hover:opacity-100 hover:border-white/20"
                )}
              >
                {thumbUrl && (
                  <Image
                    src={thumbUrl}
                    alt={`${title} miniatura ${idx + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
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
