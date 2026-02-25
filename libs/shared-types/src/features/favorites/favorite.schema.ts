import { z } from 'zod';

export const FavoriteSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  serviceId: z.string().uuid(),
  createdAt: z.coerce.date(),
});

export type FavoriteDto = z.infer<typeof FavoriteSchema>;

export const CreateFavoriteSchema = FavoriteSchema.omit({ id: true, createdAt: true });
export type CreateFavoriteDto = z.infer<typeof CreateFavoriteSchema>;
