import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBranchSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(1),
  isMain: z.boolean().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  county: z.string().optional(),
  zipCode: z.string().max(5).min(1),
  country: z.string().optional(),
  addressNotes: z.string().optional(),
  businessHours: z.any().optional(),
});

export class CreateBranchDto extends createZodDto(CreateBranchSchema) {}
