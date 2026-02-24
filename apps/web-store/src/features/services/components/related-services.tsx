"use client";

import { useRelatedServices } from "../services.hooks";
import { ServiceCard } from "./service-card";
import { Skeleton } from "@/components/ui";

interface RelatedServicesProps {
  serviceId: string;
}

export const RelatedServices = ({ serviceId }: RelatedServicesProps) => {
  const { data: related, isLoading } = useRelatedServices(serviceId);

  if (isLoading) {
    return (
      <div className="mt-12 space-y-8">
        <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Servicios Relacionados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-4/3 w-full rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!related || related.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Servicios Relacionados</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
