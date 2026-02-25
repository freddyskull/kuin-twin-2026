import * as z from 'zod';
import { sanitizeJsonObject } from 'shared-types';

export const serviceSchema = z.object({
  title: z.string().min(3, 'El título es muy corto'),
  slug: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string()])
    .default([])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      if (!val) return [];
      return val.split(',').map(tag => tag.trim()).filter(Boolean);
    }),
  description: z.string().min(10, 'La descripción es muy corta'),
  basePrice: z.coerce.number().default(0),
  showPrice: z.boolean().default(true),
  categoryId: z.string().min(1, 'La categoría es requerida'),
  unitId: z.string().optional().default(''),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  imageUrl: z.string().optional(),
  imageFile: z.any().optional(),
  imageGallery: z.array(z.string()).default([]),
  imageGalleryFiles: z.array(z.any()).default([]),
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
  dynamicAttributes: z.string().optional().transform((val, ctx) => {
    if (!val || val.trim() === '') return undefined;

    try {
      // 1. Limpieza profunda:
      // - Normaliza comillas inteligentes de todo tipo a comillas rectas "
      // - Elimina caracteres invisibles de control (frecuentes al copiar de PDFs/Webs)
      // - Elimina espacios de no-ruptura (\u00A0)
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

      // Si sanitizeJsonObject falla por algún problema de importación, devolvemos el objeto tal cual
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
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
    order: z.number().optional().default(0),
  })).default([]).transform((items) => {
    // Filter out empty items
    return items.filter(item => item.question.trim() !== '' || item.answer.trim() !== '');
  }).refine((items) => {
    // Both question and answer must be present if one is
    return items.every(item => item.question.trim() !== '' && item.answer.trim() !== '');
  }, 'Ambos campos (pregunta y respuesta) deben estar llenos'),
  slots: z.array(z.any()).optional().default([]),
  workSchedule: z.object({
    schedule: z.array(z.object({
      day: z.string(),
      enabled: z.boolean(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    holidayRules: z.object({
      workHolidays: z.boolean().default(false),
      whitelist: z.array(z.string()).optional(), // Dates worked
      blacklist: z.array(z.string()).optional(), // Dates NOT worked
    }).optional().default({ workHolidays: false }),
  }).optional(),
  companyId: z.string().min(1, 'Debes seleccionar una empresa'),
  branchIds: z.array(z.string()).default([]),
}).refine((data) => {
  if (data.showPrice) {
    return data.basePrice > 0 && data.unitId !== undefined && data.unitId !== '';
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
