import { auth } from "@/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import { GetAllUrlsParams } from "@/lib/types";
import { getAllUrls } from "@/actions/admin/url/get-all-urls";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UrlSearch from "@/components/admin/urls/url-search";
import UrlFilter from "@/components/admin/urls/url-filter";
import UrlsTable from "@/components/admin/urls/urls-table";

export const metadata: Metadata = {
  title: "Short Linker | Admin | URL Management",
  description: "Admin page for Managing URLs of Short Linker website",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
  filterBy?: string;
}>;

type AdminUrlsPageProps = {
  searchParams: SearchParams;
};

export default async function AdminUrlsPage({
  searchParams,
}: AdminUrlsPageProps) {
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
  const sortBy = (params.sortBy || "createdAt") as GetAllUrlsParams["sortBy"];
  const sortOrder = (params.sortOrder ||
    "desc") as GetAllUrlsParams["sortOrder"];
  const filterBy = (params.filterBy || "all") as GetAllUrlsParams["filterBy"];

  const getHighlightedStyle = () => {
    switch (filterBy) {
      case "security":
        return "security";
      case "inappropriate":
        return "inappropriate";
      case "other":
        return "other";

      default:
        return "none";
    }
  };

  const response = await getAllUrls({
    page,
    search,
    sortBy,
    sortOrder,
    filterBy,
  });

  const urls = (response.success && response.data && response.data.urls) || [];
  const totalUrls =
    (response.success && response.data && response.data.totalUrls) || 0;

  return (
    <>
      <div className="mb-6 flex items-center justify-center">
        <h1 className="text-3xl font-medium tracking-tight">URL Management</h1>
      </div>

      <div className="grid gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>URLs</CardTitle>
                <CardDescription>
                  View and manage all URLs in the system.
                </CardDescription>
              </div>
              <UrlSearch initialSearch={search} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <UrlFilter initialFilter={filterBy} />
              <UrlsTable
                urls={urls}
                total={totalUrls}
                currentPage={page}
                currentSearch={search}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                highlightedStyle={getHighlightedStyle()}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
