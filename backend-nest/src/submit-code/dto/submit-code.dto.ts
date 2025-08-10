import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const SubmitCodeSchema = z.object({
  code: z.string(),
  language: z.string(),
  problemId: z.number(),
});

export class SubmitCodeDto extends createZodDto(SubmitCodeSchema) {}
