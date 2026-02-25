'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button, Card, Textarea } from '@/components/ui';
import { useReviews, useCreateReview } from '../services.hooks';
import { useAuthStore } from '@/features/auth/auth.store';
import { cn } from '@/lib/utils';

interface ReviewFormProps {
  serviceId: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ serviceId }) => {
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [content, setContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Obtener reseñas existentes para verificar si el usuario ya calificó
  const { data: reviews = [] } = useReviews(serviceId);
  const createReviewMutation = useCreateReview();

  // Verificar si el usuario actual ya tiene una reseña en este servicio
  const hasAlreadyReviewed = user && reviews.some((r: any) => r.userId === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || hasAlreadyReviewed) return;

    try {
      await createReviewMutation.mutateAsync({
        serviceId,
        rating,
        content,
        userId: user.id
      });
      setIsSuccess(true);
      setContent('');
      setRating(5);
    } catch (error) {
      console.error('Error al crear la reseña:', error);
    }
  };

  if (!user) {
    return (
      <Card className="p-6 bg-card border-dashed border-border/60 text-center shadow-sm">
        <p className="text-sm text-muted-foreground mb-4">
          Inicia sesión para compartir tu experiencia con este servicio.
        </p>
        <Button variant="outline" size="sm" asChild className="rounded-full">
          <a href="/login">Iniciar Sesión</a>
        </Button>
      </Card>
    );
  }

  // Si ya ha calificado o acaba de tener éxito, mostrar mensaje de agradecimiento sin opción a repetir
  if (isSuccess || hasAlreadyReviewed) {
    return (
      <Card className="p-6 bg-primary/5 dark:bg-primary/10 border-primary/20 text-center animate-in fade-in zoom-in duration-300 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
            <Star className="w-5 h-5 text-primary fill-current" />
          </div>
          <p className="text-sm font-bold text-foreground">
            {isSuccess ? '¡Gracias por tu opinión!' : 'Ya has calificado este servicio'}
          </p>
          <p className="text-xs text-muted-foreground">
            {isSuccess
              ? 'Tu reseña ha sido publicada con éxito y ayuda a otros usuarios.'
              : 'Solo se permite una reseña por usuario para mantener la transparencia del servicio.'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-border/40 bg-card shadow-xl shadow-black/5">
      <h3 className="font-bold text-lg mb-4">Deja tu opinión</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Calificación
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="focus:outline-none transition-transform active:scale-90"
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition-colors",
                    (hover || rating) >= star
                      ? "text-yellow-500 fill-current"
                      : "text-muted-foreground/30"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
            Tu comentario (Opcional)
          </label>
          <Textarea
            placeholder="¿Qué te pareció el servicio? Tu opinión ayuda a otros usuarios..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-border/50 bg-background/50 focus:border-primary/50"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={createReviewMutation.isPending}
        >
          {createReviewMutation.isPending ? 'Enviando...' : 'Publicar Reseña'}
        </Button>
      </form>
    </Card>
  );
};
