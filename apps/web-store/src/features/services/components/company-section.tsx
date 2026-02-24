'use client';

import React from 'react';
import Image from 'next/image';
import { getAbsoluteUrl } from '@/lib/utils';
import { Badge, Card } from '@/components/ui';
import { Building2, CheckCircle, Info } from 'lucide-react';
import { CompanyDto } from 'shared-types';

interface CompanySectionProps {
  company?: CompanyDto | null;
  vendorName: string;
}

export const CompanySection: React.FC<CompanySectionProps> = ({ company, vendorName }) => {
  if (!company) {
    return (
      <Card className="p-6 border-border/40 bg-secondary/10 backdrop-blur-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <span className="text-xl font-bold uppercase">{vendorName.charAt(0)}</span>
          </div>
          <div>
            <h3 className="font-bold text-lg">{vendorName}</h3>
            <p className="text-xs text-muted-foreground italic">Proveedor de servicios certificado</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Este profesional trabaja de forma independiente, garantizando un trato directo y personalizado para cada sesión.
        </p>
      </Card>
    );
  }

  const logoUrl = getAbsoluteUrl(company.logoUrl);

  return (
    <Card className="p-6 overflow-hidden relative border-border/40 bg-secondary/10 backdrop-blur-sm group">
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-2xl border border-border/40 bg-white dark:bg-zinc-900 shadow-inner flex items-center justify-center">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={company.businessName}
              fill
              className="object-contain p-2 transition-transform group-hover:scale-110"
              unoptimized
            />
          ) : (
            <Building2 className="w-12 h-12 text-muted-foreground opacity-30" />
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">{company.businessName}</h3>
                {company.isSatVerified && (
                  <div className="text-blue-500 bg-blue-500/10 p-0.5 rounded-full" title="RFC Verificado por SAT">
                    <CheckCircle className="w-4 h-4 text-blue-500 fill-current" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Verificado por Kuin-Twin
              </p>
            </div>

            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest border-primary/20 bg-primary/5 text-primary">
              Partner
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {company.description || `Bienvenido a ${company.businessName}. Nos dedicamos a ofrecer servicios de la más alta calidad, con un equipo de profesionales comprometidos con tu satisfacción.`}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-[11px] font-semibold text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-primary" />
              Razón Social: {company.legalName}
            </div>
            {company.isSatVerified && (
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                Estatus Fiscal Activo
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
