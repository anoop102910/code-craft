import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export class LoginDto extends createZodDto(LoginSchema) {}
