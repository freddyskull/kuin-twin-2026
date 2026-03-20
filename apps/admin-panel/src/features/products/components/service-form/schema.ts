import * as z from 'zod';
import { CreateServiceSchema, sanitizeJsonObject } from 'shared-types';

export const serviceSchema = CreateServiceSchema.extend({
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
  companyId: z.string().min(1, 'Debes seleccionar una empresa'),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export interface SlotConfig {
  day: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}
