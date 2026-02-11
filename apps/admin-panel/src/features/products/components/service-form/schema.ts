import * as z from 'zod';

export const serviceSchema = z.object({
  title: z.string().min(3, 'El título es muy corto'),
  description: z.string().min(10, 'La descripción es muy corta'),
  basePrice: z.coerce.number().min(1, 'El precio debe ser positivo'),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  unitId: z.string().min(1, 'La unidad es requerida'),
  imageUrl: z.string().optional(),
  metadata: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).default([]).transform((items) => {
    // Filter out empty items (where both key and value are empty)
    return items.filter(item => item.key.trim() !== '' || item.value.trim() !== '');
  }).refine((items) => {
    // Validate that if an item exists, both key and value must be filled
    return items.every(item => item.key.trim() !== '' && item.value.trim() !== '');
  }, 'Todos los atributos deben tener etiqueta y valor'),
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
  companyIds: z.array(z.string()).min(1, 'Debes seleccionar al menos una empresa'),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export interface SlotConfig {
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}
