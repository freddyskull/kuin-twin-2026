import * as z from 'zod';
import { CreateServiceBaseSchema, sanitizeJsonObject } from 'shared-types';

export const serviceSchema = CreateServiceBaseSchema.extend({
  // Override or add UI-specific fields/transforms
  tags: z.union([z.array(z.string()), z.string()])
    .default([])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      if (!val) return [];
      return val.split(',').map(tag => tag.trim()).filter(Boolean);
    }),
  imageFile: z.any().optional(),
  imageGalleryFiles: z.array(z.any()).default([]),
  dynamicAttributes: z.string().optional().transform((val, ctx) => {
    if (!val || val.trim() === '') return undefined;

    try {
      const cleaned = val
        .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
        .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, '"')
        .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, ' ')
        .trim();

      const parsed = JSON.parse(cleaned);

      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "El JSON debe ser un objeto: { \"llave\": \"valor\" }",
        });
        return z.NEVER;
      }

      const safeObject = typeof sanitizeJsonObject === 'function'
        ? sanitizeJsonObject(parsed)
        : parsed;

      return JSON.stringify(safeObject, null, 2);
    } catch (e) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "JSON Inválido. Revisa que todas las comillas sean dobles y no sobren comas.",
      });
      return z.NEVER;
    }
  }),
  vendorId: z.string().uuid().optional(),
  categoryId: z.string().uuid('La categoría es obligatoria'),
  unitId: z.string().uuid('La unidad de medida es obligatoria').or(z.literal('')).nullish(),
  companyId: z.string().uuid('ID de empresa inválido').optional().or(z.literal('')),
  
  // Clean up metadata: remove items where both key and value are empty
  metadata: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).default([])
    .transform((items) => items.filter(item => item.key.trim() !== '' || item.value.trim() !== ''))
    .refine((items) => items.every(item => item.key.trim() !== '' && item.value.trim() !== ''), {
      message: "Todos los atributos deben tener etiqueta y valor"
    }),
}).refine((data) => {
  // UI-level price validation
  if (data.showPrice) {
    const price = Number(data.basePrice);
    return price > 0 && !!data.unitId && data.unitId !== '';
  }
  return true;
}, {
  message: "El precio y la unidad son obligatorios si decides mostrar el precio",
  path: ["basePrice"]
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export interface SlotConfig {
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}
