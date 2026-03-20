'use client';

import { useState } from 'react';
import { Star, ArrowRight, MapPin, Pencil, Trash2, User } from 'lucide-react';
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
  vendorId?: string;
  unit?: { name: string; abbreviation: string };
}

interface ServiceCardProps {
  service: ServiceDtoLite;
  LinkComponent?: any;
  ImageComponent?: any;
  currentUserId?: string;
  onEdit?: (service: ServiceDtoLite) => void;
  onDelete?: (service: ServiceDtoLite) => void;
  className?: string;
}

export const ServiceCard = ({
  service,
  LinkComponent: Link = 'a',
  ImageComponent: Image = 'img',
  currentUserId,
  onEdit,
  onDelete,
  className
}: ServiceCardProps) => {
  const [imgError, setImgError] = useState(false);
  const isOwner = service.vendorId && currentUserId === service.vendorId;
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
        <Card className="overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-xl transition-all group h-full flex flex-col border-border/40 bg-card/60 dark:bg-card/50 backdrop-blur-sm">
          {/* Service Image */}
          <div className="relative w-full aspect-4/3 overflow-hidden bg-muted/30 dark:bg-[#1a1c3d]/40">
            {!imgError && imageUrl ? (
              <Image
                src={imageUrl}
                alt={service.title || 'Servicio'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                {...(Image !== 'img' ? { fill: true, unoptimized: true } : {})}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-primary/5 text-foreground/40 gap-2">
                <span className="text-4xl opacity-20">🛠️</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-30">Sin imagen</span>
              </div>
            )}

            {/* Price Badge */}
            {service.showPrice && service.basePrice ? (
              <div className="absolute top-3 right-3 bg-background/95 backdrop-blur-md px-3 py-1.5 rounded-2xl text-[11px] font-black shadow-lg border border-primary/20 z-10 text-primary">
                {formatCurrency(service.basePrice)}
                {service.unit && (
                  <span className="text-[10px] font-normal opacity-70 ml-1">
                    / {service.unit.abbreviation || service.unit.name}
                  </span>
                )}
              </div>
            ) : service.showPrice === false && (
              <div className="absolute top-3 right-3 bg-yellow-400 dark:bg-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.4)] backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black z-10 text-black uppercase tracking-[0.05em] border border-yellow-200/50 animate-in fade-in zoom-in duration-500">
                Por Cotizar
              </div>
            )}

            {/* Owner Badge */}
            {isOwner && (
              <div className="absolute top-3 left-3 bg-black/60 shadow-xl backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 z-10 flex items-center gap-1.5 animate-in fade-in zoom-in duration-500">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">Tú Servicio</span>
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col grow">
            <div className="flex flex-col mb-2">
              <h3 className="font-bold md:text-lg line-clamp-1 group-hover:text-primary transition-colors text-card-foreground">
                {service.title || 'Servicio sin título'}
              </h3>
              {service.company && (
                <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground/60">
                  {service.company.businessName}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-[10px] font-bold">{Number(service.starsRate || 5).toFixed(1)}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">
                ({service.reviewsCount || 0} reseñas)
              </span>
            </div>

            <p className="text-xs text-muted-foreground line-clamp-2 mb-3 h-10 leading-relaxed">
              {service.description || "Este profesional no ha proporcionado una descripción detallada todavía."}
            </p>

            {/* Tags / Keywords */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {service.tags.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted/60 dark:bg-secondary/30 text-muted-foreground border border-border/40 dark:border-white/5"
                  >
                    #{tag}
                  </span>
                ))}
                {service.tags.length > 3 && (
                  <span className="text-[8px] font-bold text-muted-foreground/60">
                    +{service.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-border/40 flex items-center justify-between mt-auto">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>Disponible</span>
              </div>

              {isOwner ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit?.(service);
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-primary/30 text-slate-400 hover:text-primary transition-all group/btn"
                    title="Editar servicio"
                  >
                    <Pencil className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete?.(service);
                    }}
                    className="p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-red-500/10 hover:border-red-500/30 text-slate-400 hover:text-red-500 transition-all group/btn"
                    title="Eliminar servicio"
                  >
                    <Trash2 className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              ) : (
                <span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform ml-auto">
                  Ver detalles <ArrowRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
