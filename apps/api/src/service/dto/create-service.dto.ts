import { createZodDto } from 'nestjs-zod';
import { CreateServiceSchema } from 'shared-types';

export class CreateServiceDto extends createZodDto(CreateServiceSchema) {}
