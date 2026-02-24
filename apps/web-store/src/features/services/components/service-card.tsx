"use client";

import { ServiceDto } from 'shared-types';
import { Card } from '@/components/ui';
import { Star, ArrowRight, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getAbsoluteUrl } from '@/lib/utils';
import { useState } from 'react';

interface ServiceCardProps {
  service: ServiceDto;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getAbsoluteUrl(service.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Link href={`/services/${service.slug}`} className="block h-full">
        <Card className="overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-xl transition-all group h-full flex flex-col border-border/50 bg-card/50 backdrop-blur-sm">
          {/* Service Image */}
          <div className="relative w-full aspect-4/3 overflow-hidden bg-muted">
            {!imgError && imageUrl ? (
              <Image
                src={imageUrl}
                alt={service.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => setImgError(true)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-muted-foreground gap-2">
                <span className="text-4xl">🛠️</span>
                <span className="text-xs font-medium opacity-50">Sin imagen</span>
              </div>
            )}

            {/* Price Badge */}
            {service.showPrice && service.basePrice && (
              <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold shadow-sm border border-border/50 z-10">
                {`$${Number(service.basePrice).toFixed(2)}`}
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col grow">
            <div className="flex flex-col mb-2">
              <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              {service.company && (
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/70">
                  {service.company.businessName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span className="text-xs font-bold">{Number(service.starsRate).toFixed(1)}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({service.reviewsCount} reseñas)
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 grow">
              {service.description || "Sin descripción disponible para este servicio."}
            </p>

            <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>A 2.5 km</span>
              </div>

              {/* Conditional Price Display at Footer */}
              {!service.showPrice && (
                <span className="text-sm font-bold text-primary">A Cotizar</span>
              )}

              <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                Ver detalles <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
