
import { z } from "zod";
import { CreateProfileSchema } from "shared-types";

// Asumir que los valores nulos deben ser tratados como cadenas vacías en formularios
// Esto es común con react-hook-form y defaultValues.
export const ProfileFormSchema = CreateProfileSchema.extend({
  // Transformar de null a "" para el formulario
  bio: z.string().nullable().default(""),
  avatarUrl: z.string().url().nullable().optional(),
  
  // Las redes sociales son opcionales y strings
  website: z.string().url().nullable().optional(),
  phone: z.string().nullable().optional(), 
  whatsapp: z.string().nullable().optional(),
  facebook: z.string().nullable().optional(),
  instagram: z.string().nullable().optional(),
  tiktok: z.string().nullable().optional(),
  twitter: z.string().nullable().optional(),
  linkedin: z.string().nullable().optional(),
  youtube: z.string().nullable().optional(),
  
  // Location (por ahora opcionales como string o number si queremos inputs manuales)
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  
  // Radios y configuración
  serviceRadiusKm: z.coerce.number().min(1).default(10), // coerce string input to number
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
