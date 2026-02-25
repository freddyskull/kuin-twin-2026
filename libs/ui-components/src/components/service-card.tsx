'use client';

import { useState } from 'react';
import { Star, ArrowRight, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn, getAbsoluteUrl, formatCurrency } from '../lib/utils';
import { Card } from './ui/card';

interface ServiceDtoLite {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  basePrice?: number | string | null;
  showPrice?: boolean;
  imageUrl?: string | null;
  starsRate?: string | number;
  reviewsCount?: number;
  tags?: string[];
  company?: { businessName: string };
}

interface ServiceCardProps {
  service: ServiceDtoLite;
  LinkComponent?: any;
  ImageComponent?: any;
  className?: string;
}

export const ServiceCard = ({
  service,
  LinkComponent: Link = 'a',
  ImageComponent: Image = 'img',
  className
}: ServiceCardProps) => {
  const [imgError, setImgError] = useState(false);
  const imageUrl = getAbsoluteUrl(service.imageUrl);

  const wrapperProps = Link === 'a' ? { href: `/services/${service.slug || ''}` } : { href: `/services/${service.slug || ''}` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("h-full", className)}
    >
      <Link {...wrapperProps} className="block h-full no-underline">
        <Card className="overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-xl transition-all group h-full flex flex-col border-border/50 bg-card/50 backdrop-blur-sm">
          {/* Service Image */}
          <div className="relative w-full aspect-4/3 overflow-hidden bg-[#1a1c3d]/40">
            {!imgError && imageUrl ? (
              <Image
                src={imageUrl}
                alt={service.title || 'Servicio'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                {...(Image !== 'img' ? { fill: true, unoptimized: true } : {})}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-slate-700 gap-2">
                <span className="text-4xl opacity-20">🛠️</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Sin imagen</span>
              </div>
            )}

            {/* Price Badge */}
            {service.showPrice && service.basePrice ? (
              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[11px] font-black shadow-lg border border-primary/20 z-10 text-primary">
                {formatCurrency(service.basePrice)}
              </div>
            ) : service.showPrice === false && (
              <div className="absolute top-3 right-3 bg-primary/20 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[9px] font-black shadow-lg border border-primary/40 z-10 text-primary uppercase tracking-widest">
                Por Cotizar
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col grow">
            <div className="flex flex-col mb-2">
              <h3 className="font-bold text-base md:text-lg line-clamp-1 group-hover:text-primary transition-colors text-white">
                {service.title || 'Servicio sin título'}
              </h3>
              {service.company && (
                <span className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                  {service.company.businessName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-bold">{Number(service.starsRate || 5).toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-slate-500">
                ({service.reviewsCount || 0} reseñas)
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 mb-3 h-10 leading-relaxed">
              {service.description || "Este profesional no ha proporcionado una descripción detallada todavía."}
            </p>

            {/* Tags / Keywords */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {service.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/30 text-slate-500 border border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
                {service.tags.length > 3 && (
                  <span className="text-[8px] font-bold text-slate-600">
                    +{service.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <MapPin className="w-3 h-3" />
                <span>Disponible</span>
              </div>

              <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                Ver detalles <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
