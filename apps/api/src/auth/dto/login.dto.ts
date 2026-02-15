import { createZodDto } from 'nestjs-zod';
import { LoginSchema } from 'shared-types';

export class LoginDto extends createZodDto(LoginSchema) {}
