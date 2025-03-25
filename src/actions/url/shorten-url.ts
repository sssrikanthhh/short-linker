"use server";

import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

import { urlSchema } from "@/lib/schemas";
import { ApiResponse } from "@/lib/types";
import { ensureHttps } from "@/lib/utils";
import { prisma } from "@/lib/prisma-client";
import { ATTEMPTS_LIMIT, BASE_URL } from "@/lib/constants";
import { auth } from "@/auth";
import { checkUrlSafety } from "./check-url-safety";

export async function shortenUrl(
  formData: FormData,
  attempts = 0,
): Promise<
  ApiResponse<{
    shortUrl: string;
    flagged: boolean;
    flagReason?: string | null;
    message?: string;
  }>
> {
  //handling the edge case nanoid creating duplicates(unlikely) and preventing stack overflow
  if (attempts > ATTEMPTS_LIMIT) {
    return {
      success: false,
      error: "Failed to shorten URL, please try again.",
    };
  }

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const url = formData.get("url") as string;
    const customCode = formData.get("customCode") as string;

    const validatedData = urlSchema.safeParse({
      url,
      customCode: customCode || undefined,
    });
    if (!validatedData.success) {
      return {
        success: false,
        error:
          validatedData.error.flatten().fieldErrors.url?.[0] ||
          validatedData.error.flatten().fieldErrors.customCode?.[0] ||
          "Invalid URL or custom code",
      };
    }

    const originalUrl = ensureHttps(validatedData.data.url);

    const safetyCheck = await checkUrlSafety(originalUrl);
    let flagged = false;
    let flagReason: string | null = null;

    if (safetyCheck.success && safetyCheck.data) {
      flagged = safetyCheck.data.flagged;
      flagReason = safetyCheck.data.reason;

      if (
        safetyCheck.data.category === "malicious" &&
        safetyCheck.data.confidence > 0.7 &&
        session?.user?.role !== "ADMIN"
      ) {
        return {
          success: false,
          error: "This URL is marked as malicious.",
        };
      }
    }

    const shortCode = validatedData.data.customCode || nanoid(8);

    const existingCode = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });
    //if the code exists, recursively call the function to generate a new code
    if (existingCode) {
      if (validatedData.data.customCode)
        return {
          success: false,
          error: "Custom code is already taken, please choose another one.",
        };
      return await shortenUrl(formData, attempts + 1);
    }

    await prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        userId: userId || null,
        flagged,
        flagReason,
      },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        shortUrl: `${BASE_URL}/sl/${shortCode}`,
        flagged,
        flagReason,
        message: flagged
          ? "URL flagged as unsafe and suspicious by our system, It may be temporarily limited until further review by the administrator."
          : undefined,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to shorten URL, please try again.",
    };
  }
}
