import { getServiceBySlug } from '@/features/services/services.api';
import { getAbsoluteUrl, formatCurrency } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { ArrowLeft, Star, MapPin, Calendar, MessageCircle, Share2, Heart, ShieldCheck, Clock } from 'lucide-react';
import { ServiceDto } from 'shared-types';
import { StatusIndicator } from '@/features/chat/components';
import { ServiceGallery, CompanySection, ReviewForm, ReviewList, RelatedServices, ServiceFaqs, ServiceHeader, FloatingVendorBadge } from '@/features/services';
import { BookingDialog } from '@/features/bookings';

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

// Generación de metadatos SEO dinámicos
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // En Next.js 15+ params puede ser una promesa, pero en 14 es objeto directo o promesa. ASUMIR 15+ es seguro usar await
  // Si params es promesa: const { slug } = await params;
  // Como no sé la versión exacta (Next 16.1.6 según package.json), debo tratar params como Promise
  // PERO, en la definición de PageProps, params es { slug: string }
  // Next 15 cambió params a Promise. Next 14 NO.
  // Package.json dice "next": "16.1.6".
  // ENTONCES params ES UNA PROMESA.
  const { slug } = await params;

  try {
    const service = await getServiceBySlug(slug);
    if (!service || !service.isActive) return {};

    return {
      title: `${service.title} | Kuin-Twin`,
      description: service.description || `Reserva ${service.title} en Kuin-Twin. El mejor servicio garantizado.`,
      openGraph: {
        images: service.imageUrl ? [getAbsoluteUrl(service.imageUrl)!] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Servicio no encontrado | Kuin-Twin',
    };
  }
}

export default async function ServicePage({ params }: PageProps) {
  // Await params required in Next 15+
  const { slug } = await params;

  let service: ServiceDto;

  try {
    service = await getServiceBySlug(slug);
    // Si el servicio no está activo, no mostrarlo en la tienda web
    if (!service.isActive) {
      notFound();
    }
  } catch (error: any) {
    notFound();
  }

  const imageUrl = getAbsoluteUrl(service.imageUrl);

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Navigation Bar Improved */}
      <ServiceHeader
        serviceId={service.id}
        vendorId={service.vendorId}
        title={service.title}
        description={service.description || undefined}
      />

      {/* Hero Section */}
      <div className="relative pt-24 container-app flex flex-col md:flex-row gap-8 lg:gap-12 z-10">

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 lg:w-3/5">
          <ServiceGallery
            mainImage={service.imageUrl ?? null}
            gallery={service.imageGallery || []}
            title={service.title}
          />

          <Card className="mt-8 flex items-center gap-2 p-4 rounded-2xl bg-card border-border/40 shadow-sm mb-6">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs font-medium text-muted-foreground">
              Este servicio cumple con los estándares de calidad de <span className="text-foreground font-bold">Kuin-Twin</span>.
            </p>
          </Card>

          {/* Service Attributes (Metadata) */}
          {service.metadata && service.metadata.length > 0 && (
            <div className="space-y-4 mb-10 text-center">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">Especificaciones</h3>
              <div className="grid grid-cols-2 gap-4">
                {service.metadata.map((item, idx) => (
                  <Card key={idx} className="p-3 rounded-xl bg-card/60 dark:bg-secondary/5 border border-border/40 hover:border-primary/20 transition-all hover:shadow-md group flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase text-nowrap">{item.key}:</span>
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{item.value}</span>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Work Schedule */}
          {service.workSchedule && (service.workSchedule as Record<string, any>).schedule &&
            Array.isArray((service.workSchedule as any).schedule) && (
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-2 justify-center">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">Horarios de Atención</h3>
                </div>
                <Card className="p-6 border-border/40 bg-card/80 dark:bg-secondary/5 shadow-sm">
                  {(service.workSchedule as any).schedule.map((day: any) => {
                    const dayLabels: Record<string, string> = {
                      Monday: 'Lunes',
                      Tuesday: 'Martes',
                      Wednesday: 'Miércoles',
                      Thursday: 'Jueves',
                      Friday: 'Viernes',
                      Saturday: 'Sábado',
                      Sunday: 'Domingo',
                    };
                    return (
                      <div key={day.day} className="flex items-center justify-between py-1 border-b border-border/10 last:border-0">
                        <span className={`text-xs font-medium ${day.enabled ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                          {dayLabels[day.day] || day.day}
                        </span>
                        <div className="flex items-center gap-2">
                          {!day.enabled && <div className="h-1 w-1 rounded-full bg-red-400" />}
                          <span className={`text-[11px] font-bold ${day.enabled ? 'text-foreground' : 'text-red-400/80 uppercase'}`}>
                            {day.enabled ? `${day.startTime} - ${day.endTime}` : 'Cerrado'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </Card>
              </div>
            )}


          {/* Location & Map Section */}
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary/80">Donde se Presta el Servicio</h3>
            </div>
            <Card className="overflow-hidden border-border/40 bg-card/80 dark:bg-secondary/5 shadow-sm rounded-2xl group transition-all hover:shadow-xl hover:shadow-primary/5">
              <div className="p-5 flex items-start gap-4 bg-background/40">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground leading-tight">
                    {service.address || "Dirección por definir con el profesional"}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span>Zona de Disponibilidad</span>
                    <span className="h-1 w-1 rounded-full bg-primary" />
                    <span>A 2.5 km de tu ubicación</span>
                  </p>
                </div>
              </div>

              <div className="h-[220px] w-full bg-muted relative overflow-hidden">
                {service.address ? (
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'contrast(1.05) brightness(1.02)' }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(service.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-30">
                    <MapPin className="w-8 h-8" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Mapa no disponible</span>
                  </div>
                )}

                {/* Overlay for better integration */}
                <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5" />

                {service.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border/50 shadow-lg hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
                  >
                    Abrir en Mapas
                  </a>
                )}
              </div>
            </Card>
          </div>

          <CompanySection
            company={service.company}
            vendorName={service.vendor?.profile?.displayName || 'Profesional'}
          />

          {/* FAQs Section */}
          {service.faqs && service.faqs.length > 0 && (
            <ServiceFaqs faqs={service.faqs} />
          )}

          {/* Section: Reviews */}
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Experiencias y Opiniones</h2>
            <ReviewForm serviceId={service.id} />
            <ReviewList serviceId={service.id} />
          </div>
        </div>

        {/* Right Column: Details & Booking */}
        <div className="w-full md:w-1/2 lg:w-2/5 space-y-8">
          <div className="flex flex-col">
            {service.category && (
              <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 px-3 py-1 bg-primary/10 rounded-full w-fit">
                {service.category.name}
              </span>
            )}
            <div className="flex items-start justify-between">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{service.title}</h1>
            </div>

            {/* Tags / Keywords */}
            {service.tags && service.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-card border border-border/40 text-muted-foreground shadow-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20">
                <Star className="w-4 h-4 fill-current" />
                {service.starsRate} <span className="text-muted-foreground font-normal">({service.reviewsCount} reseñas)</span>
              </div>
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                A 2.5 km de ti
              </span>
              <div className="h-4 w-px bg-border/50 mx-1" />
              <StatusIndicator userId={service.vendorId} showText />
            </div>

            <div className="flex items-end gap-2 mb-8">
              <span className="text-4xl font-bold text-primary">
                {service.showPrice && service.basePrice
                  ? formatCurrency(service.basePrice)
                  : 'A Cotizar'}
              </span>
              {service.showPrice && service.basePrice && (
                <span className="text-muted-foreground text-sm font-medium mb-1.5">
                  / {service.unit?.name || 'servicio'}
                </span>
              )}
            </div>

            <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-10 leading-relaxed">
              {service.description || "Este profesional no ha proporcionado una descripción detallada, pero su reputación habla por sí sola."}
            </div>




          </div>

          {/* Call to Action Box - Sticky */}
          <div className="sticky top-24">
            <Card className="p-6 border-primary/20 bg-card dark:bg-primary/5 backdrop-blur-sm shadow-xl shadow-primary/5">
              <h3 className="font-bold text-lg mb-4">
                {service.showPrice ? 'Reservar este servicio' : 'Solicitar Cotización'}
              </h3>

              {service.showPrice ? (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/50 hover:border-primary/50 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <div className="flex flex-col text-left">
                          <span className="text-xs text-muted-foreground font-semibold">Fecha y Hora</span>
                          <span className="text-sm font-medium">Seleccionar disponibilidad</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <BookingDialog
                      serviceId={service.id}
                      serviceTitle={service.title}
                      basePrice={service.basePrice ? Number(service.basePrice) : null}
                      unitName={service.unit?.name}
                    >
                      <Button className="flex-1 rounded-full text-lg h-12 shadow-lg shadow-primary/20">
                        Reservar Ahora
                      </Button>
                    </BookingDialog>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-primary/20 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary transition-colors">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Sin cobros ocultos. Cancelación gratuita hasta 24h antes.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-6">
                    Este servicio requiere una evaluación previa para determinar el costo exacto. Contacta al experto para una cotización.
                  </p>
                  <Link href={`/chat/new?vendorId=${service.vendorId}&serviceId=${service.id}`} className="w-full block">
                    <Button className="w-full rounded-full text-lg h-12 shadow-lg shadow-primary/20 gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Chat con el Experto
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Respuesta promedio: menos de 15 minutos.
                  </p>
                </>
              )}
            </Card>
          </div>
        </div>

      </div>

      <div className="container-app z-10 relative">
        <RelatedServices serviceId={service.id} />
      </div>

      {/* Floating UI Elements */}
      {service.vendor && (
        <FloatingVendorBadge
          vendor={service.vendor as any}
          serviceId={service.id}
        />
      )}
    </div>
  );
}
