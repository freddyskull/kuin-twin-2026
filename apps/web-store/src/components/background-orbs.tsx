'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export const BackgroundOrbs = () => {
  const pathname = usePathname();

  // No mostrar en auth pages porque ya tienen sus propios orbes específicos
  const isAuthPage = pathname === '/login' || pathname === '/registro';
  if (isAuthPage) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Orb Superior Izquierdo — Oro Kuin */}
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary/10 dark:bg-primary/20 rounded-full blur-[140px] animate-pulse pointer-events-none opacity-60 dark:opacity-100" />

      {/* Orb Inferior Derecho — Azul suave */}
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-400/5 dark:bg-blue-500/10 rounded-full blur-[140px] pointer-events-none opacity-50 dark:opacity-80" />
    </div>
  );
};
