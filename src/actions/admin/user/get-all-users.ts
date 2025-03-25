"use server";

import { ApiResponse, User, GetAllUsersParams } from "@/lib/types";
import { prisma } from "@/lib/prisma-client";
import { auth } from "@/auth";

export async function getAllUsers(
  params: GetAllUsersParams = {},
): Promise<ApiResponse<{ users: User[]; totalUsers: number }>> {
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
    } = params;

    const skip = (page - 1) * limit;

    let allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
      },
    });

    //apply search filter
    if (search) {
      allUsers = allUsers.filter((user) => {
        return (
          user.name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    const totalUsers = allUsers.length;
    //apply sort by
    if (sortBy && sortOrder) {
      allUsers.sort((a, b) => {
        let valueA: any = a[sortBy];
        let valueB: any = b[sortBy];

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
    const paginatedUsers = allUsers.slice(skip, skip + limit);

    return {
      success: true,
      data: {
        users: paginatedUsers,
        totalUsers,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch users, please try again.",
    };
  }
}
