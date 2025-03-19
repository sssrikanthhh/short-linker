"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { ApiResponse } from "@/lib/types";

export async function deleteUrl(
  urlId: string,
): Promise<ApiResponse<{ message: string }>> {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized, you are not allowed to modify this resource.",
      };
    }

    const currentUrl = await prisma.url.findUnique({
      where: {
        id: urlId,
      },
    });

    if (!currentUrl) {
      return {
        success: false,
        error: "Not found, the URL does not exist.",
      };
    }

    if (currentUrl.userId !== session.user.id) {
      return {
        success: false,
        error: "Unauthorized, you are not allowed to modify this resource.",
      };
    }

    await prisma.url.delete({
      where: {
        id: urlId,
      },
    });
    return {
      success: true,
      data: {
        message: "URL deleted successfully.",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to delete URL, please try again.",
    };
  }
}
