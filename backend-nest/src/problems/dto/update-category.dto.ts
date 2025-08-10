import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export class UpdateCategoryDto extends createZodDto(UpdateCategorySchema) {}
