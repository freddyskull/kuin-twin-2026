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
      <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-primary/20 dark:bg-primary/20 rounded-full blur-[160px] animate-pulse pointer-events-none opacity-80 dark:opacity-100" />

      {/* Orb Inferior Derecho — Azul suave */}
      <div className="absolute bottom-[-15%] right-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[160px] pointer-events-none opacity-60 dark:opacity-80" />

      {/* Orb Central — Ambar suave para calidez */}
      <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-amber-400/5 dark:bg-amber-400/5 rounded-full blur-[140px] pointer-events-none opacity-40 dark:opacity-60" />
    </div>
  );
};
