import { createZodDto } from 'nestjs-zod';
import { CreateCategorySchema, UpdateCategorySchema } from 'shared-types';

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
