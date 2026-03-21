import { z } from 'zod';
import { DecimalSchema } from '../../common/decimal';

// Esquema base de perfil (Salida)
export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  bio: z.string().max(1000, 'La biografía no puede exceder los 1000 caracteres').nullable(),
  avatarUrl: z.string().nullable(),
  
  // Localización (Geometría PostGIS serializada)
  location: z.any().nullable(),
  
  serviceRadiusKm: z.number().int().min(1).max(500).default(10),
  starsRatio: z.number().int().default(0),
  
  // Redes y contacto
  phone: z.string().min(8, 'Teléfono inválido').nullable(),
  whatsapp: z.string().min(8, 'WhatsApp inválido').nullable(),
  facebook: z.string().url('URL de Facebook inválida').nullable(),
  instagram: z.string().url('URL de Instagram inválida').nullable(),
  tiktok: z.string().url('URL de TikTok inválida').nullable(),
  twitter: z.string().url('URL de Twitter inválida').nullable(),
  linkedin: z.string().url('URL de LinkedIn inválida').nullable(),
  youtube: z.string().url('URL de YouTube inválida').nullable(),
  website: z.string().url('URL de sitio web inválida').nullable(),
  
  ratingAvg: DecimalSchema,
  reviewsCount: z.number().int().default(0),
  businessHours: z.any().nullable(),
  isVerified: z.boolean().default(false),
  
  companyId: z.string().uuid().nullable(),
});

// Esquema de entrada (para crear/actualizar)
export const CreateProfileSchema = ProfileSchema.pick({
  displayName: true,
  bio: true,
  avatarUrl: true,
  serviceRadiusKm: true,
  phone: true,
  whatsapp: true,
  facebook: true,
  instagram: true,
  tiktok: true,
  twitter: true,
  linkedin: true,
  youtube: true,
  website: true,
  businessHours: true,
  companyId: true,
}).extend({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export const UpdateProfileSchema = CreateProfileSchema.partial();

export type ProfileDto = z.infer<typeof ProfileSchema>;
export type CreateProfileInput = z.infer<typeof CreateProfileSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

// Alias de compatibilidad
export type Profile = ProfileDto;
