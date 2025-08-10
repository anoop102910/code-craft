import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string(),
  description: z.string(),
});

export class CreateCategoryDto extends createZodDto(CreateCategorySchema) {}
