"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Loader,
  MoreHorizontalIcon,
  Shield,
  UserIcon,
} from "lucide-react";

import { User } from "@/lib/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/actions/admin/user/update-user-role";
import { Role } from "@/lib/types";

type UsersTableProps = {
  users: User[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy?: string;
  currentSortOrder?: string;
};

export default function UsersTable({
  users,
  total,
  currentPage,
  currentSearch,
  currentSortBy,
  currentSortOrder,
}: UsersTableProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const basePath =
    typeof window !== undefined ? window.location.pathname : "/admin/urls";

  const limit = 10;
  const totalPages = Math.ceil(total / limit);

  const handleSort = (column: string) => {
    const params = new URLSearchParams();

    if (currentSearch) {
      params.set("search", currentSearch);
    }

    params.set("sortBy", column);
    if (currentSortBy === column) {
      params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortOrder", "asc");
    }

    params.set("page", "1");

    const url = `${basePath}?${params.toString()}`;
    router.push(url);
  };

  const getPaginationItems = () => {
    const items = [];

    // const basePath = window.location.pathname

    // always show first page
    items.push(
      <PaginationItem key="first">
        <PaginationLink
          href={`${basePath}?page=1&${currentPage ? `${currentSearch}` : ""}&${
            currentSortBy
              ? `sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
              : ""
          }
            `}
          isActive={currentPage === 1}
        >
          1
        </PaginationLink>
      </PaginationItem>,
    );
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationLink href="#">...</PaginationLink>
        </PaginationItem>,
      );
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (i === 1 || i === totalPages) {
        continue;
      }
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`${basePath}?page=${i}&${currentSearch ? `search=${currentSearch}` : ""}&${
              currentSortBy
                ? `sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                : ""
            }`}
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationLink href="#">...</PaginationLink>
        </PaginationItem>,
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={`${basePath}?page=${totalPages}&${currentSearch ? `search=${currentSearch}` : ""}&${
              currentSortBy
                ? `sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                : ""
            }`}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  const getSortIcon = (column: string) => {
    if (currentSortBy !== column) {
      return <ArrowUpDown className="ml-2 size-4" />;
    }
    return currentSortOrder === "asc" ? (
      <ArrowUp className="ml-2 size-4" />
    ) : (
      <ArrowDown className="ml-2 size-4" />
    );
  };

  const getUserIntitals = (name: string | null) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    const initials = names.map((name) => name[0]).join("");
    return initials;
  };

  const handleRoleToggle = async (userId: string, currentRole: Role) => {
    setIsLoading(userId);
    const newRole = currentRole === "USER" ? "ADMIN" : "USER";
    try {
      const response = await updateUserRole(userId, newRole as Role);
      if (response.success) {
        toast("User role updated successfully.", {
          description: `User role changed to ${newRole}.`,
        });
        router.refresh();
      } else {
        toast.error("Failed to update user role.", {
          description: response.error || "An error occurred.",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user role.", {
        description: "Internal server error, try again.",
      });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <button
                  onClick={() => handleSort("name")}
                  className="flex w-full items-center justify-start gap-2 font-medium"
                >
                  User
                  {getSortIcon("name")}
                </button>
              </TableHead>

              <TableHead>
                <button
                  onClick={() => handleSort("email")}
                  className="flex w-full items-center justify-start gap-2 font-medium"
                >
                  Email
                  {getSortIcon("email")}
                </button>
              </TableHead>

              <TableHead className="w-[100px]">
                <button
                  onClick={() => handleSort("role")}
                  className="flex w-full items-center justify-start gap-2 font-medium"
                >
                  Role
                  {getSortIcon("role")}
                </button>
              </TableHead>

              <TableHead className="w-[150px]">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="flex w-full items-center justify-start gap-2 font-medium"
                >
                  Joined
                  {getSortIcon("createdAt")}
                </button>
              </TableHead>

              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {currentSearch ? "No results found." : "No users found."}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage
                          src={user.image || undefined}
                          alt={user.name || "user avatar"}
                        />
                        <AvatarFallback className="text-xs uppercase">
                          {getUserIntitals(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-base font-medium">
                          {user.name || "Anonymous"}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          ID: {user.id.substring(0, 6)}...
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell className="text-xs">
                    <Badge
                      variant={
                        user.role === "ADMIN" ? "destructive" : "secondary"
                      }
                      className="flex w-fit items-center"
                    >
                      {user.role === "ADMIN" ? <Shield /> : <UserIcon />}
                      <span className="text-[10px]">{user.role}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDistanceToNow(new Date(user.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLoading === user.id}
                          className="hover:bg-transparent"
                          title="actions"
                        >
                          {isLoading === user.id ? (
                            <Loader className="size-4 animate-spin" />
                          ) : (
                            <MoreHorizontalIcon />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className={
                            user.role === "ADMIN"
                              ? "text-red-600 dark:text-red-400"
                              : "text-green-600 dark:text-green-400"
                          }
                          onClick={() =>
                            handleRoleToggle(user.id, user.role as Role)
                          }
                        >
                          <span>
                            {user.role === "ADMIN" ? "Demote" : "Promote"} to{" "}
                            {user.role === "ADMIN" ? "user" : "admin"}
                          </span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`${basePath}?page=${Math.max(1, currentPage - 1)}&${currentSearch ? `search=${currentSearch}` : ""}&${
                  currentSortBy
                    ? `sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                    : ""
                }`}
              />
            </PaginationItem>
            {getPaginationItems()}
            <PaginationItem>
              <PaginationNext
                href={`${basePath}?page=${Math.min(
                  totalPages,
                  currentPage + 1,
                )}&${currentSearch ? `search=${currentSearch}` : ""}&${
                  currentSortBy
                    ? `sortBy=${currentSortBy}&sortOrder=${currentSortOrder}`
                    : ""
                }`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <div className="text-muted-foreground text-xs">
        Showing {users.length} of {total} users.
        {currentSearch && ` Search results for "${currentSearch}".`}
      </div>
    </div>
  );
}
