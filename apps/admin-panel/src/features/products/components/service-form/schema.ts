import * as z from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(3, 'El título es muy corto'),
  description: z.string().min(10, 'La descripción es muy corta'),
  basePrice: z.coerce.number().min(1, 'El precio debe ser positivo'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  unitId: z.string().min(1, 'La unidad es requerida'),
  imageUrl: z.string().optional(),
  metadata: z.array(z.object({
    key: z.string().min(1, 'Etiqueta requerida'),
    value: z.string().min(1, 'Valor requerido'),
  })).default([]),
  dynamicAttributes: z.string().optional().refine((val) => {
    if (!val) return true;
    try {
      JSON.parse(val);
      return true;
    } catch {
      return false;
    }
  }, 'JSON Inválido'),
  slots: z.array(z.any()).optional().default([]),
  workSchedule: z.object({
    schedule: z.array(z.object({
      day: z.string(),
      enabled: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    holidayRules: z.object({
      workHolidays: z.boolean(),
      whitelist: z.array(z.string()).optional(), // Dates worked
      blacklist: z.array(z.string()).optional(), // Dates NOT worked
    }).optional(),
  }).optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export interface SlotConfig {
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}
