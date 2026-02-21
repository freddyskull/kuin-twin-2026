import { createZodDto } from 'nestjs-zod';
import { LoginResponseSchema } from 'shared-types';

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
