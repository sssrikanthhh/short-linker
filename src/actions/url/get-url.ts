"use server";

import { prisma } from "@/lib/prisma-client";
import { ApiResponse } from "@/lib/types";

export async function getUrlByShortCode(shortCode: string): Promise<
  ApiResponse<{
    originalUrl: string;
    flagged?: boolean;
    flagReason?: string | null;
  }>
> {
  try {
    const url = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    if (!url) {
      return {
        success: false,
        error: "URL not found.",
      };
    }

    // Increment the click count
    await prisma.url.update({
      where: {
        shortCode,
      },
      data: {
        clicks: {
          increment: 1,
        },
      },
    });

    return {
      success: true,
      data: {
        originalUrl: url.originalUrl,
        flagged: url.flagged,
        flagReason: url.flagReason,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while fetching the URL.",
    };
  }
}
