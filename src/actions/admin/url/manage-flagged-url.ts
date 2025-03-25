"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma-client";
import { revalidatePath } from "next/cache";

export type Action = "approve" | "delete";

export async function manageFlaggedUrl(urlId: string, action: Action) {
  try {
    const session = await auth();
    if (!session?.user) {
      return {
        success: false,
        error: "Unauthorized, only logged in users can access this resource.",
      };
    }
    if (session?.user?.role !== "ADMIN") {
      return {
        success: false,
        error: "Unauthorized, you are not allowed to modify this resource.",
      };
    }

    const urlToManage = await prisma.url.findUnique({
      where: {
        id: urlId,
      },
    });

    if (!urlToManage) {
      return {
        success: false,
        error: "Not found, the URL does not exist.",
      };
    }

    if (action === "approve") {
      await prisma.url.update({
        where: {
          id: urlId,
        },
        data: {
          flagged: false,
          flagReason: null,
        },
      });
    } else if (action === "delete") {
      await prisma.url.delete({
        where: {
          id: urlId,
        },
      });
    } else {
      return {
        success: false,
        error: "Invalid action.",
      };
    }

    revalidatePath("/admin/urls");
    revalidatePath("/admin/urls/flagged");

    return {
      success: true,
      data: {
        message: `URL ${action}d successfully.`,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to manage URL, please try again.",
    };
  }
}
