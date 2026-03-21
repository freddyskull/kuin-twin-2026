import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.string().uuid(),
  businessName: z.string().min(3),
  logoUrl: z.string().nullish(),
  description: z.string().nullish(),
  
  // Datos Fiscales (RFC)
  rfc: z.string().length(13),
  legalName: z.string(),
  fiscalRegime: z.string(),
  
  // Dirección Fiscal
  taxAddress: z.string(),
  taxAddressZip: z.string().length(5),
  taxAddressCity: z.string(),
  taxAddressState: z.string(),
  taxAddressCounty: z.string().nullish(),
  
  // SAT Verification
  isSatVerified: z.boolean().default(false),
  satVerifiedAt: z.coerce.date().nullish(),
  satCertificateUrl: z.string().nullish(),
  satVerificationDoc: z.string().nullish(),
  
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isActive: z.boolean().default(true),
});

export type CompanyDto = z.infer<typeof CompanySchema>;
