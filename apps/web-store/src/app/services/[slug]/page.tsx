import { getServiceBySlug } from '@/features/services/services.api';
import { getAbsoluteUrl } from '@/lib/utils';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { ArrowLeft, Star, MapPin, Calendar, MessageCircle, Share2, Heart, ShieldCheck } from 'lucide-react';
import { ServiceDto } from 'shared-types';
import { StatusIndicator } from '@/features/chat/components';

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
    if (!service) return {};

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
  } catch (error) {
    notFound();
  }

  const imageUrl = getAbsoluteUrl(service.imageUrl);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Navigation Bar Transparent */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-border/10 bg-background/50">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hover:text-red-500 hover:bg-red-500/10">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 z-10">

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 lg:w-3/5 space-y-4">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border/50 shadow-2xl bg-muted">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={service.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                unoptimized // Fix for localhost images
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground bg-secondary/30">
                <span className="text-6xl">🛠️</span>
              </div>
            )}
            <div className="absolute bottom-4 left-4 flex gap-2">
              <div className="bg-background/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-border/50 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-green-500" />
                Garantía Kuin-Twin
              </div>
            </div>
          </div>

          {/* Thumbnails (Placeholder) */}
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-xl bg-muted border border-border/50 hover:border-primary cursor-pointer transition-colors relative overflow-hidden group">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt="Gallery"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                    unoptimized
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Booking */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col">
          <div className="flex items-start justify-between">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{service.title}</h1>
          </div>

          <div className="flex items-center gap-4 text-sm mb-6">
            <div className="flex items-center gap-1 text-yellow-500 font-bold bg-yellow-500/10 px-2 py-0.5 rounded-md">
              <Star className="w-4 h-4 fill-current" />
              {service.starsRate} <span className="text-muted-foreground font-normal">({service.reviewsCount} reseñas)</span>
            </div>
            <span className="text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              A 2.5 km de ti
            </span>
            <div className="h-4 w-px bg-border/50 mx-1" />
            <StatusIndicator userId={service.vendorId} showText />
          </div>

          <div className="flex items-end gap-2 mb-8">
            <span className="text-4xl font-bold text-primary">
              {service.showPrice && service.basePrice
                ? `$${service.basePrice}`
                : 'A Cotizar'}
            </span>
            {service.showPrice && service.basePrice && (
              <span className="text-muted-foreground text-sm font-medium mb-1.5">
                / {service.unitId ? 'servicio' : 'sesión'}
              </span>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert text-muted-foreground mb-8 line-clamp-6">
            {service.description || "Este profesional no ha proporcionado una descripción detallada, pero su reputación habla por sí sola."}
          </div>

          {/* Call to Action Box */}
          <Card className="p-6 border-primary/20 bg-primary/5 backdrop-blur-sm mt-auto shadow-lg shadow-primary/5">
            <h3 className="font-bold text-lg mb-4">
              {service.showPrice ? 'Reservar este servicio' : 'Solicitar Cotización'}
            </h3>

            {service.showPrice ? (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50 hover:border-primary/50 cursor-pointer transition-colors group">
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
                  <Button className="flex-1 rounded-full text-lg h-12 shadow-lg shadow-primary/20">
                    Reservar Ahora
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-primary/20 bg-background hover:bg-primary/10 hover:text-primary hover:border-primary">
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
  );
}
