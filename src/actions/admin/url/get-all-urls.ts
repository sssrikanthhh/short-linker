"use server";

import { auth } from "@/auth";
import { ApiResponse, UrlWithUser, GetAllUrlsParams } from "@/lib/types";
import { prisma } from "@/lib/prisma-client";

export async function getAllUrls(
  params: GetAllUrlsParams = {},
): Promise<ApiResponse<{ urls: UrlWithUser[]; totalUrls: number }>> {
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
        error: "Unauthorized, you are not allowed to access this resource.",
      };
    }

    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      filterBy = "all",
    } = params;

    const skip = (page - 1) * limit;

    const allUrls = await prisma.url.findMany({
      include: {
        user: true,
      },
    });

    let transformedUrls: UrlWithUser[] = allUrls.map((url) => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      clicks: url.clicks,
      createdAt: url.createdAt,
      userId: url.userId,
      userName: url.user?.name || null,
      userEmail: url.user?.email || null,
      flagged: url.flagged,
      flagReason: url.flagReason,
    }));

    //apply search filter
    if (search) {
      transformedUrls = transformedUrls.filter((url) => {
        return (
          url.originalUrl.toLowerCase().includes(search.toLowerCase()) ||
          url.shortCode.toLowerCase().includes(search.toLowerCase()) ||
          url.userName?.toLowerCase().includes(search.toLowerCase()) ||
          url.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
          url.flagReason?.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    //apply filter by
    if (filterBy !== "all") {
      transformedUrls = transformedUrls.filter((url) => {
        if (filterBy === "flagged") {
          return url.flagged;
        }
        if (filterBy === "security" && url.flagReason) {
          return (
            url.flagReason.toLowerCase().includes("security") ||
            url.flagReason.toLowerCase().includes("phishing") ||
            url.flagReason.toLowerCase().includes("malware")
          );
        }

        if (filterBy === "inappropriate" && url.flagReason) {
          return (
            url.flagReason.toLowerCase().includes("inappropriate") ||
            url.flagReason.toLowerCase().includes("adult") ||
            url.flagReason.toLowerCase().includes("offensive")
          );
        }
        if (filterBy === "other" && url.flagReason) {
          return (
            !url.flagReason.toLowerCase().includes("security") &&
            !url.flagReason.toLowerCase().includes("phishing") &&
            !url.flagReason.toLowerCase().includes("malware") &&
            !url.flagReason.toLowerCase().includes("inappropriate") &&
            !url.flagReason.toLowerCase().includes("adult") &&
            !url.flagReason.toLowerCase().includes("offensive")
          );
        }
        return false;
      });
    }

    const totalUrls = transformedUrls.length;

    //apply sort by
    if (sortBy && sortOrder) {
      transformedUrls.sort((a, b) => {
        let valueA: any;
        let valueB: any;

        // handle sorting by username
        if (sortBy === "userName") {
          valueA = a.userName || a.userEmail || "";
          valueB = b.userName || b.userEmail || "";
        } else {
          valueA = a[sortBy];
          valueB = b[sortBy];
        }

        //handle null values
        if (valueA === null) valueA = "";
        if (valueB === null) valueB = "";

        //sort in asc or desc order
        if (sortOrder === "asc") {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      });
    }

    //apply pagination
    const paginatedUrls = transformedUrls.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        urls: paginatedUrls,
        totalUrls,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch URLs, please try again.",
    };
  }
}
