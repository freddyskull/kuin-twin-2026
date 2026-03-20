"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

interface ServiceDistanceProps {
  lat?: number | null;
  lng?: number | null;
}

export function ServiceDistance({ lat, lng }: ServiceDistanceProps) {
  const [distance, setDistance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!lat || !lng) return;

    // Intentar obtener ubicación del usuario en el cliente
    if (!navigator.geolocation) return;

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        // Fórmula de Haversine para calcular distancia en KM
        const R = 6371; // Radio de la Tierra en KM
        const dLat = (lat - userLat) * (Math.PI / 180);
        const dLon = (lng - userLng) * (Math.PI / 180);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(userLat * (Math.PI / 180)) *
            Math.cos(lat * (Math.PI / 180)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;

        setDistance(d);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      },
      { timeout: 5000 }
    );
  }, [lat, lng]);

  if (!lat || !lng) return null;

  return (
    <span className="text-muted-foreground flex items-center gap-1.5 animate-in fade-in duration-700">
      <MapPin className="w-3.5 h-3.5 text-primary" />
      {isLoading ? (
        <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 animate-pulse">Calculando...</span>
      ) : distance !== null ? (
        <span className="font-medium">A {distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`} de ti</span>
      ) : (
        <span className="font-medium">Ubicación disponible</span>
      )}
    </span>
  );
}
