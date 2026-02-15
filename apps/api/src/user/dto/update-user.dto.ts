import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema } from 'shared-types';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}

export type UpdateUserInput = UpdateUserDto;
