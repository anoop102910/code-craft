import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const CreateProblemSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  difficulty: z.string(),
  acceptance: z.number(),
  frequency: z.number(),
  example_test_cases: z.string(),
  all_test_cases: z.string(),
  constraints: z.string(),
  status: z.string().optional(),
  time_limit: z.number(),
  memory_limit: z.number(),
  categoryId: z.number().optional(),
});

export class CreateProblemDto extends createZodDto(CreateProblemSchema) {}
