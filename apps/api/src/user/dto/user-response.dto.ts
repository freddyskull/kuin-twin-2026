import { createZodDto } from 'nestjs-zod';
import { UserResponseSchema } from 'shared-types';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
