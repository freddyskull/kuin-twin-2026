import { createZodDto } from 'nestjs-zod';
import { RegisterUserNestedSchema } from 'shared-types';

/**
 * DTO para registro anidado (Usuario + Perfil)
 * Ahora hereda directamente del esquema compartido para asegurar consistencia.
 */
export class RegisterUserNestedDto extends createZodDto(RegisterUserNestedSchema) {}

export type RegisterUserNestedInput = RegisterUserNestedDto;
