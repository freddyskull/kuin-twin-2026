import { z } from 'zod';

export const PortfolioItemSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string().uuid(),
  imageUrl: z.string(),
  description: z.string().nullish(),
  imageGallery: z.array(z.string()).default([]),
  dynamicAttributes: z.record(z.any()).nullish(),
});

export type PortfolioItemDto = z.infer<typeof PortfolioItemSchema>;
