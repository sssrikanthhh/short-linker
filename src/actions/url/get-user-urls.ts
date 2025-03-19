import { auth } from "@/auth";
import { ApiResponse, Url } from "@/lib/types";
import { prisma } from "@/lib/prisma-client";

export async function getUserUrls(
  userId: string,
): Promise<ApiResponse<{ userUrls: Url[] }>> {
  try {
    const session = await auth();
    if (!session?.user || session.user.id !== userId) {
      return {
        success: false,
        error: "Unauthorized, you are not allowed to access this resource.",
      };
    }

    const userUrls = await prisma.url.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      success: true,
      data: {
        userUrls,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch user URLs, please try again.",
    };
  }
}
