import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.");

export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: passwordSchema,
});

export const registerSchema = loginSchema
  .extend({
    name: z.string().min(3, "Name must be at least 3 characters."),
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type UrlFormData = z.infer<typeof urlSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
