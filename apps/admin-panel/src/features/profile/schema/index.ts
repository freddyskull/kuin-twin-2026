
import { z } from "zod";
import { CreateProfileSchema } from "shared-types";

// Asumir que los valores nulos deben ser tratados como cadenas vacías en formularios
// Esto es común con react-hook-form y defaultValues.
export const ProfileFormSchema = CreateProfileSchema.extend({
  // Transformar de null a "" para el formulario
  bio: z.string().nullable().default(""),
  avatarUrl: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),

  // Las redes sociales son opcionales y strings
  website: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  phone: z.string().nullable().optional(), 
  whatsapp: z.string().nullable().optional(),
  facebook: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  instagram: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  tiktok: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  twitter: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  linkedin: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  youtube: z.string().url("URL inválida").or(z.literal("")).nullable().optional(),
  
  // Location (por ahora opcionales como string o number si queremos inputs manuales)
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  
  // Radios y configuración
  serviceRadiusKm: z.coerce.number().min(1).default(10), // coerce string input to number
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;
