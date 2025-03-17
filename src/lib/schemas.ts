import { z } from 'zod';

export const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL.')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email.'),
  password: z.string().min(6, 'Password must be at least 6 characters.')
});

export type UrlFormData = z.infer<typeof urlSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
