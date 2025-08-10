import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const UpdateProblemSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  difficulty: z.string().optional(),
  acceptance: z.number().optional(),
  frequency: z.number().optional(),
  example_test_cases: z.string().optional(),
  all_test_cases: z.string().optional(),
  constraints: z.string().optional(),
  status: z.string().optional(),
  time_limit: z.number().optional(),
  memory_limit: z.number().optional(),
  categoryId: z.number().optional(),
});

export class UpdateProblemDto extends createZodDto(UpdateProblemSchema) {}
