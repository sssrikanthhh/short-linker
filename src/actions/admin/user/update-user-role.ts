"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { Role } from "@/lib/types";
import { prisma } from "@/lib/prisma-client";

export async function updateUserRole(userId: string, role: Role) {
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

    //prevent changing own role
    if (session?.user?.id === userId) {
      return {
        success: false,
        error: "Bad request, you cannot change your own role.",
      };
    }

    if (role !== Role.USER && role !== Role.ADMIN) {
      return {
        success: false,
        error: "Bad request, invalid role.",
      };
    }
    const userToUpdate = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!userToUpdate) {
      return {
        success: false,
        error: "Not found, the user does not exist.",
      };
    }
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    });

    revalidatePath("/admin/users");

    return {
      success: true,
      data: {
        message: "User role updated successfully.",
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update user role, please try again.",
    };
  }
}
