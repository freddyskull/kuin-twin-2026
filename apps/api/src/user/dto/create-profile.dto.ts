import { createZodDto } from 'nestjs-zod';
import { CreateProfileSchema } from 'shared-types';

export class CreateProfileDto extends createZodDto(CreateProfileSchema) {}

export type CreateProfileInput = CreateProfileDto;
