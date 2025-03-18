"use server";

import { hashValue } from "@/lib/bcrypt";
import { prisma } from "@/lib/prisma-client";
import { registerSchema } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";

export async function registerUser(formData: FormData): Promise<
  ApiResponse<{
    message: string;
    data: string;
  }>
> {
  try {
    const originalSchema = registerSchema._def.schema;
    const validatedData = originalSchema
      .omit({
        confirmPassword: true,
      })
      .safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });

    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.flatten().fieldErrors.name?.[0] ||
          validatedData.error.flatten().fieldErrors.email?.[0] ||
          validatedData.error.flatten().fieldErrors.password?.[0] ||
          "Invalid data",
      };
    }

    const { name, email, password } = validatedData.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User already exists.",
      };
    }

    const hashedPassword = await hashValue(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    return {
      success: true,
      data: {
        message: "User registered successfully.",
        data: newUser.id,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: "Failed to register, try again.",
    };
  }
}
