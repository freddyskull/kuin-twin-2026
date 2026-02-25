'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import { ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ScrollTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Mostrar el botón cuando se hace scroll hacia abajo
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={cn(
        'fixed bottom-8 right-8 z-50 transition-all duration-300 transform',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
      )}
    >
      <Button
        variant="default"
        size="icon"
        onClick={scrollToTop}
        className="h-12 w-12 rounded-full shadow-2xl shadow-primary/40 group hover:scale-110 active:scale-95 transition-all"
        aria-label="Volver arriba"
      >
        <ChevronUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
      </Button>
    </div>
  );
}
