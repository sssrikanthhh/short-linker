"use server";

import { auth } from "@/auth";
import { updateUrlSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma-client";
import { BASE_URL } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/lib/types";

export async function updateUrl(
  formData: FormData,
): Promise<ApiResponse<{ shortUrl: string; message: string }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: "Unauthorized, you are not allowed to modify this resource.",
      };
    }

    const validatedData = updateUrlSchema.safeParse({
      id: formData.get("id"),
      customCode: formData.get("customCode"),
    });

    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.flatten().fieldErrors.id?.[0] ||
          validatedData.error.flatten().fieldErrors.customCode?.[0] ||
          "Invalid URL ID",
      };
    }

    const { id, customCode } = validatedData.data;

    const currentUrl = await prisma.url.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!currentUrl) {
      return {
        success: false,
        error: "Not found, the URL does not exist.",
      };
    }

    //check if the custom code is already taken
    const existingCode = await prisma.url.findFirst({
      where: {
        shortCode: customCode,
        id: {
          not: id,
        },
      },
    });

    if (existingCode) {
      return {
        success: false,
        error: "Custom code is already taken, please choose another one.",
      };
    }

    await prisma.url.update({
      where: {
        id,
      },
      data: {
        shortCode: customCode,
      },
    });

    const baseUrl = BASE_URL || window.location.origin;
    const shortUrl = `${baseUrl}/sl/${customCode}`;

    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        shortUrl,
        message: "URL updated successfully.",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update URL, please try again.",
    };
  }
}
