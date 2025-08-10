import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
