"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Ban,
  CheckCircle,
  Copy,
  ExternalLink,
  Loader,
  MoreHorizontal,
} from "lucide-react";

import { UrlWithUser } from "@/lib/types";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  manageFlaggedUrl,
  Action,
} from "@/actions/admin/url/manage-flagged-url";

type UrlsTableProps = {
  urls: UrlWithUser[];
  total: number;
  currentPage: number;
  currentSearch: string;
  currentSortBy?: string;
  currentSortOrder?: string;
  currentFilterBy?: string;
  highlightedStyle: "security" | "inappropriate" | "other" | "none";
};

export default function UrlsTable({
  urls,
  total,
  currentPage,
  currentSearch,
  currentSortBy,
  currentSortOrder,
  highlightedStyle,
}: UrlsTableProps) {
  const router = useRouter();
  const [copyingId, setCopyingId] = useState<string | null>(null);
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

  const getHighlightedStyles = (url: UrlWithUser) => {
    if (!url.flagReason) return "";

    switch (highlightedStyle) {
      case "security":
        return "bg-red-100 dark:bg-red-900/20 hover:bg-red-50/80 dark:hover:bg-red-900/40";
      case "inappropriate":
        return "bg-orange-100 dark:bg-orange-900/20 hover:bg-orange-50/80 dark:hover:bg-orange-900/40";
      case "other":
        return "bg-yellow-100 dark:bg-yellow-900/20 hover:bg-yellow-50/80 dark:hover:bg-yellow-900/40";
      default:
        return url.flagged ? "bg-yellow-50/50 dark:bg-yellow-900/10" : "";
    }
  };

  const getFlagIconColor = () => {
    switch (highlightedStyle) {
      case "security":
        return "text-red-600 dark:text-red-400";
      case "inappropriate":
        return "text-orange-600 dark:text-orange-400";
      case "other":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const truncateUrl = (url: string, length: number = 35) => {
    if (url.length <= length) {
      return url;
    }
    return url.slice(0, length) + "...";
  };

  //url actions
  const handleCopy = async (id: string, shortCode: string) => {
    setCopyingId(id);
    const shortUrl = `${window.location.origin}/sl/${shortCode}`;
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success("Short URL catch to clipboard.");
    } catch (error) {
      toast.error("Failed to copy.");
      console.error("Failed to copy: ", error);
    } finally {
      setTimeout(() => {
        setCopyingId(null);
      }, 1000);
    }
  };

  const handleMangageFlaggedUrl = async (urlId: string, action: Action) => {
    setActionLoading(urlId);
    try {
      const response = await manageFlaggedUrl(urlId, action);
      if (response.success) {
        toast.success(
          response?.data?.message || `URL ${action}d successfully.`,
        );
        router.refresh();
      } else {
        toast.error(response.error || `Failed to ${action} URL.`);
        console.error(response.error);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to ${action} URL.`, {
        description: "Internal server error, try again.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("originalUrl")}
                >
                  Original URL
                  {getSortIcon("originalUrl")}
                </button>
              </TableHead>
              <TableHead className="w-[150px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("shortCode")}
                >
                  Short Code
                  {getSortIcon("shortCode")}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("clicks")}
                >
                  Clicks
                  {getSortIcon("clicks")}
                </button>
              </TableHead>
              <TableHead className="w-[150px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("userName")}
                >
                  Created by
                  {getSortIcon("userName")}
                </button>
              </TableHead>
              <TableHead className="w-[300px]">
                <button
                  className="flex items-center font-medium"
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                  {getSortIcon("createdAt")}
                </button>
              </TableHead>
              <TableHead className="w-[80px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.length === 0 ? (
              <TableRow>
                <TableCell>
                  {currentSearch ? "No results found." : "No URLs found."}
                </TableCell>
              </TableRow>
            ) : (
              urls.map((url) => (
                <TableRow key={url.id} className={getHighlightedStyles(url)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {url.flagged && (
                        <div
                          className={getFlagIconColor()}
                          title={
                            url.flagReason ||
                            "Flagged for potential safety concerns by AI."
                          }
                        >
                          <AlertTriangle className="size-4" />
                        </div>
                      )}
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex max-w-[250px] items-center gap-1 text-blue-600 hover:underline"
                      >
                        {truncateUrl(url.originalUrl)}
                        <ExternalLink className="size-3" />
                      </a>
                    </div>
                    {url.flagged && url.flagReason && (
                      <div className="mt-1 max-w-[250px] truncate overflow-hidden text-xs text-ellipsis text-yellow-600 dark:text-yellow-400">
                        {url.flagReason}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted rounded px-1.5 py-0.5 text-[10px]">
                        {url.shortCode}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        title="Copy to clipboard"
                        onClick={() => handleCopy(url.id, url.shortCode)}
                        disabled={copyingId === url.id}
                      >
                        {copyingId === url.id ? (
                          <Loader className="size-3 animate-spin" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{url.clicks}</Badge>
                  </TableCell>
                  <TableCell>
                    {url?.userId ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={undefined}
                            alt={url.userName || "user avatar"}
                          />
                          <AvatarFallback className="text-xs uppercase">
                            {url.userName?.substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {url.userName || url.userEmail || "Anonymous"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-primary-foreground text-sm">
                        Anonymous
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {formatDistanceToNow(new Date(url.createdAt), {
                      addSuffix: true,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Copy short url</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={url.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit original url
                          </a>
                        </DropdownMenuItem>
                        {url.flagged && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-green-600 dark:text-green-400"
                              onClick={() =>
                                handleMangageFlaggedUrl(url.id, "approve")
                              }
                            >
                              <CheckCircle className="size-4 text-green-600 dark:text-green-400" />
                              {actionLoading === url.id ? (
                                <>
                                  <Loader className="size-4 animate-spin" />
                                  <span>Approving...</span>
                                </>
                              ) : (
                                "Approve url"
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() =>
                                handleMangageFlaggedUrl(url.id, "delete")
                              }
                            >
                              <Ban className="size-4 text-red-600 dark:text-red-400" />
                              {actionLoading === url.id ? (
                                <>
                                  <Loader className="size-4 animate-spin" />
                                  <span>Deleting...</span>
                                </>
                              ) : (
                                "Delete url"
                              )}
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
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
        Showing {urls.length} of {total} URLs.
        {currentSearch && ` Search results for "${currentSearch}".`}
      </div>
    </div>
  );
}
