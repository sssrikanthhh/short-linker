import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters.");
export const customCodeSchema = z
  .string()
  .max(20, "Custom code must be less than 20 characters.");

export const urlSchema = z.object({
  url: z.string().url("Please enter a valid URL."),
  customCode: customCodeSchema
    .transform((val) => (val === "" ? undefined : val)) // Convert empty string to undefined
    .optional() // Make it optional
    .refine(
      (val) => val === undefined || /^[a-zA-Z0-9_-]+$/.test(val),
      "Custom code must contain only letters, numbers, underscores, and hyphens.",
    ),
});

export const updateUrlSchema = z.object({
  id: z.string(),
  customCode: customCodeSchema
    .min(3, "Custom code must be at least 3 characters.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Custom code must contain only letters, numbers, underscores, and hyphens.",
    ),
});

export const updateUrlSchemaWithoutId = updateUrlSchema.omit({ id: true });

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
export type UpdateUrlFormData = z.infer<typeof updateUrlSchemaWithoutId>;
