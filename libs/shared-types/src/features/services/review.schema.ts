import { z } from 'zod';

export const ReviewSchema = z.object({
  id: z.string().uuid(),
  content: z.string().nullish(),
  rating: z.number().min(1).max(5).default(5),
  serviceId: z.string().uuid(),
  userId: z.string().uuid(),
  
  // Joins opcionales
  user: z.object({
    profile: z.object({
      displayName: z.string(),
      avatarUrl: z.string().nullish(),
    }).nullish(),
  }).optional(),
  
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export type ReviewDto = z.infer<typeof ReviewSchema>;

export const CreateReviewSchema = ReviewSchema.omit({ 
  id: true, 
  user: true, 
  createdAt: true, 
  updatedAt: true 
});

export type CreateReviewDto = z.infer<typeof CreateReviewSchema>;
