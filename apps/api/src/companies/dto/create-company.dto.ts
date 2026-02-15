import { createZodDto } from 'nestjs-zod';
import { CompanySchema } from 'shared-types';

// Omitir 'id' ya que se genera automáticamente
export class CreateCompanyDto extends createZodDto(CompanySchema.omit({ id: true })) {}
