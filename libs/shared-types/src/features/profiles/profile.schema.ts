import { z } from 'zod';
import { DecimalSchema } from '../../common/decimal';

// Esquema base de perfil (campos escalares, sin relaciones)
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().min(1),
  bio: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
  serviceRadiusKm: z.number().int().default(0),
  starsRatio: z.number().int().default(0),
  phone: z.string().nullable(),
  whatsapp: z.string().nullable(),
  facebook: z.string().nullable(),
  instagram: z.string().nullable(),
  tiktok: z.string().nullable(),
  twitter: z.string().nullable(),
  linkedin: z.string().nullable(),
  youtube: z.string().nullable(),
  website: z.string().nullable(),
  ratingAvg: DecimalSchema,
  reviewsCount: z.number().int().default(0),
  businessHours: z.any().nullable(),
  isVerified: z.boolean().default(false),
  companyId: z.string().uuid().nullable(),
});

export type ProfileDto = z.infer<typeof ProfileSchema>;

// Alias de compatibilidad
export type Profile = ProfileDto;
