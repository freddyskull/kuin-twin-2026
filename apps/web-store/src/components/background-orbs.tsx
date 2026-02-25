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
      {/* Orb Superior Izquierdo — mismo estilo que registro */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Orb Inferior Derecho — mismo estilo que registro */}
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
};
