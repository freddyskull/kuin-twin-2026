import { z } from 'zod';

// Schema universal para Decimal que acepta string, number o objetos tipo Decimal
// Esto permite que el frontend reciba strings/numbers y el backend objetos Decimal
export const DecimalSchema = z.union([
  z.number(),
  z.string(),
  z.custom<any>((val) => {
    return (
      typeof val === 'object' &&
      val !== null &&
      ('d' in val || 'toFixed' in val || Symbol.toStringTag in val)
    );
  }),
]);

export type Decimal = z.infer<typeof DecimalSchema>;
