'use client';

import { Star, MapPin, MessageCircle } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ServiceGallery } from './service-gallery';
import { ServiceFaqs } from './service-faqs';

interface ServiceDetailPreviewProps {
  service: {
    title?: string;
    description?: string;
    basePrice?: number | string;
    showPrice?: boolean;
    imageUrl?: string | null;
    imageGallery?: string[];
    category?: { name: string };
    unit?: { abbreviation: string };
    tags?: string[];
    starsRate?: string | number;
    reviewsCount?: number;
    metadata?: Array<{ key: string; value: string }>;
    faqs?: Array<{ question: string; answer: string }>;
    address?: string;
    workSchedule?: any;
    company?: { name: string; logoUrl?: string };
    vendor?: { profile?: { displayName?: string } };
  };
  ImageComponent?: any;
  className?: string;
}

export const ServiceDetailPreview: React.FC<ServiceDetailPreviewProps> = ({ service, ImageComponent, className }) => {
  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-full overflow-hidden", className)}>
      {/* Visual Header: Gallery */}
      <ServiceGallery
        mainImage={service.imageUrl || null}
        gallery={service.imageGallery || []}
        title={service.title || 'Vista Previa'}
        ImageComponent={ImageComponent}
      />

      {/* Basic Info */}
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          {service.category && (
            <Badge variant="secondary" className="w-fit bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest">
              {service.category.name}
            </Badge>
          )}
          <h1 className="text-2xl font-bold text-white tracking-tight leading-tight">
            {service.title || 'Sin Título'}
          </h1>
        </div>

        {/* Tags */}
        {service.tags && service.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {service.tags.map((tag, idx) => (
              <span key={idx} className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-secondary/20 text-slate-400 border border-white/5">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Ratings & Status */}
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded">
            <Star className="w-3 h-3 fill-current" />
            {service.starsRate || '5.0'} <span className="text-slate-500 font-normal">({service.reviewsCount || 0})</span>
          </div>
          <span className="text-slate-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Zona Centro
          </span>
          <div className="flex items-center gap-1.5 text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            En línea
          </div>
        </div>

        {/* Price */}
        <div className="flex items-end gap-1.5 py-4 border-y border-white/5">
          <span className="text-3xl font-black text-primary">
            {service.showPrice ? formatCurrency(service.basePrice) : 'A Cotizar'}
          </span>
          {service.showPrice && (
            <span className="text-slate-500 text-[10px] font-bold uppercase mb-1.5">
              / {service.unit?.abbreviation || 'Unidad'}
            </span>
          )}
        </div>

        {/* Description */}
        <div className="text-sm text-slate-400 leading-relaxed line-clamp-4 italic">
          {service.description || "Sin descripción disponible todavía..."}
        </div>
      </div>

      {/* Technical Specs */}
      {service.metadata && service.metadata.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-l-2 border-primary pl-2">Especificaciones</h3>
          <div className="grid grid-cols-2 gap-2">
            {service.metadata.map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 flex flex-col gap-0.5">
                <span className="text-[9px] font-bold text-slate-500 uppercase">{item.key}</span>
                <span className="text-[10px] font-black text-white truncate">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs Section */}
      {service.faqs && service.faqs.length > 0 && (
        <ServiceFaqs faqs={service.faqs} />
      )}

      {/* Footer Mockup */}
      <Card className="p-4 bg-primary/5 border-primary/20 mt-4 text-center">
        <p className="text-[10px] text-slate-400 mb-3">Este es un ejemplo de cómo se verá tu publicación</p>
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xs uppercase">Reservar</div>
          <div className="h-10 w-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-slate-400">
            <MessageCircle className="w-4 h-4" />
          </div>
        </div>
      </Card>
    </div>
  );
};
