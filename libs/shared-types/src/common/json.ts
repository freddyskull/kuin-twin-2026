import { z } from 'zod';

/////////////////////////////////////////
// JSON HELPERS (Independiente de Prisma)
/////////////////////////////////////////

// Tipo genérico para valores JSON - compatible con cualquier entorno
export type NullableJsonInput = any | null | 'JsonNull' | 'DbNull';

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return 'DbNull';
  if (v === 'JsonNull') return 'JsonNull';
  return v;
};

export const JsonValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<any> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

export const NullableJsonNullValueInputSchema = z.enum(['DbNull', 'JsonNull']);

export const JsonNullValueInputSchema = z.enum(['JsonNull']);

export const JsonNullValueFilterSchema = z.enum(['DbNull', 'JsonNull', 'AnyNull']);
