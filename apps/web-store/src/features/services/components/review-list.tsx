'use client';

import React from 'react';
import { useReviews } from '../services.hooks';
import { Star, MessageSquareOff } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ReviewListProps {
  serviceId: string;
}

export const ReviewList: React.FC<ReviewListProps> = ({ serviceId }) => {
  const { data: reviews, isLoading } = useReviews(serviceId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 w-full bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-40">
        <MessageSquareOff className="w-12 h-12 mb-2" />
        <p className="text-sm">Aún no hay reseñas para este servicio.</p>
        <p className="text-xs">¡Sé el primero en dejar una!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="flex gap-4 p-5 rounded-2xl bg-card border border-border/40 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
          <Avatar className="w-10 h-10 border border-border/40 shadow-inner">
            <AvatarImage src={review.user?.profile?.avatarUrl || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
              {review.user?.profile?.displayName?.[0] || '?'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm">
                {review.user?.profile?.displayName || 'Usuario anónimo'}
              </h4>
              <span className="text-[10px] text-muted-foreground font-medium">
                {review.createdAt && formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                  locale: es
                })}
              </span>
            </div>

            <div className="flex gap-0.5 mb-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= (review.rating || 0)
                    ? "text-yellow-500 fill-current"
                    : "text-muted-foreground/20"
                    }`}
                />
              ))}
            </div>

            {review.content && (
              <p className="text-sm text-muted-foreground leading-relaxed italic">
                "{review.content}"
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
