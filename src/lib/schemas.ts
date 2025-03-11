import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url()
});

export type UrlFormData = z.infer<typeof urlSchema>;
