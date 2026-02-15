import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from 'shared-types';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}

export type CreateUserInput = CreateUserDto;
