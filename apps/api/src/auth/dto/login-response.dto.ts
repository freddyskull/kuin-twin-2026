import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginResponseSchema = z.object({
  access_token: z.string().describe('Token JWT para autenticación'),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: z.enum(['ADMIN', 'VENDOR', 'CUSTOMER']),
    // Add other fields as necessary, matching what AuthService returns
  }).describe('Información del usuario autenticado'),
});

export class LoginResponseDto extends createZodDto(LoginResponseSchema) {}
