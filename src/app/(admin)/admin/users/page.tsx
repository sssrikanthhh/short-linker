import { auth } from "@/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { GetAllUsersParams } from "@/lib/types";
import { getAllUsers } from "@/actions/admin/user/get-all-users";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserSearch from "@/components/admin/users/user-search";
import UsersTable from "@/components/admin/users/users-table";

export const metadata: Metadata = {
  title: "Short Linker | Admin | User Management",
  description: "Admin page for Managing Users of Short Linker website",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}>;

type AdminUsersPageProps = {
  searchParams: SearchParams;
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const page = params.page ? Number(params.page) : 1;
  const search = params.search || "";
  const sortBy = (params.sortBy || "createdAt") as GetAllUsersParams["sortBy"];
  const sortOrder = (params.sortOrder ||
    "desc") as GetAllUsersParams["sortOrder"];

  const response = await getAllUsers({
    page,
    search,
    sortBy,
    sortOrder,
  });

  const users =
    (response.success && response.data && response.data.users) || [];
  const totalUsers =
    (response.success && response.data && response.data.totalUsers) || 0;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium tracking-tight">User Management</h1>
        <Link href="/admin" passHref>
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="size-4" />
            Back to Admin
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              View and manage all users in the system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UserSearch initialSearch={search} />
              <UsersTable
                users={users}
                total={totalUsers}
                currentPage={page}
                currentSearch={search}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
