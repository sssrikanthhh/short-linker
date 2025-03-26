import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";

import { auth } from "@/auth";
import { GetAllUrlsParams } from "@/lib/types";
import { getAllUrls } from "@/actions/admin/url/get-all-urls";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UrlsTable from "@/components/admin/urls/urls-table";

export const metadata: Metadata = {
  title: "Short Linker | Admin | Flagged URLs",
  description: "Admin page for Managing Flagged URLs of Short Linker website",
};

type SearchParams = Promise<{
  page?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}>;

type FlaggedUrlsPageProps = {
  searchParams: SearchParams;
};

export default async function FlaggedUrlsPage({
  searchParams,
}: FlaggedUrlsPageProps) {
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

  const response = await getAllUrls({
    page,
    search,
    sortBy,
    sortOrder,
  });

  const urls =
    (response.success &&
      response.data &&
      response.data.urls.filter((url) => url.flagged)) ||
    [];
  const totalUrls = urls.length || 0;

  const categorizedUrls = urls.reduce(
    (acc, url) => {
      const reason = url.flagReason || "other";
      const category = reason.toLowerCase().includes("inappropriate")
        ? "inappropriate"
        : reason.toLowerCase().includes("security") ||
            reason.toLowerCase().includes("phishing") ||
            reason.toLowerCase().includes("malware") ||
            reason.toLowerCase().includes("suspicous")
          ? "security"
          : "other";

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(url);
      return acc;
    },
    {} as Record<string, typeof urls>,
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-medium tracking-tight">Flagged URLs</h1>
          <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1.5 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <AlertTriangle className="size-4" />
            <span className="text-xs font-medium">
              {totalUrls} URLs required review.
            </span>
          </div>
        </div>

        <Link href="/admin/urls" passHref>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            title="Back to all URLs"
          >
            <ArrowLeft className="size-4" />
            Back to all URLs
          </Button>
        </Link>
      </div>

      {totalUrls === 0 ? (
        <div>
          <Card className="border-green-200 shadow-sm dark:border-green-800">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-8">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No Flagged URLs</h3>
              <p className="text-muted-foreground max-w-md text-center">
                All URLs have been reviewed and are safe to use.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-8">
          <Card className="border-yellow-200 shadow-sm dark:border-yellow-800">
            <CardHeader className="border-b border-yellow-100 bg-yellow-50/50 px-3 py-1 dark:border-yellow-900/50 dark:bg-yellow-900/20">
              <div className="flex items-center gap-1">
                <div className="flex items-center justify-center">
                  <AlertTriangle className="size-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <CardTitle className="text-yellow-800 dark:text-yellow-300">
                  Flagged URLs
                </CardTitle>
              </div>
              <CardDescription className="text-muted-foreground text-sm">
                These URLs have been flagged by our AI system for potential
                unsafe and inappropriate. Please review them and take
                appropriate action.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* for security */}
              {categorizedUrls?.security &&
                categorizedUrls.security.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldAlert className="size-5 text-red-500 dark:text-red-300" />
                      <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
                        Security Concerns
                      </h3>
                    </div>

                    <Card className="mb-6 border-red-200 bg-red-50/30 shadow-sm dark:border-red-900/50 dark:bg-red-900/10">
                      <CardContent className="pt-4">
                        <p className="mb-2 text-sm text-red-700 dark:text-red-400">
                          These URLs have been flagged for potential security
                          concerns. Please review them and take appropriate
                          action.
                        </p>
                      </CardContent>
                    </Card>
                    <UrlsTable
                      urls={categorizedUrls.security}
                      total={categorizedUrls.security.length}
                      currentPage={page}
                      currentSearch={search}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      highlightedStyle="security"
                    />
                  </div>
                )}

              {/* for inappropriate */}
              {categorizedUrls?.inappropriate &&
                categorizedUrls.inappropriate.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-2">
                      <ShieldAlert className="size-5 text-red-500 dark:text-red-300" />
                      <h3 className="text-lg font-medium text-red-700 dark:text-red-400">
                        Inappropriate Content
                      </h3>
                    </div>

                    <Card className="mb-6 border-red-200 bg-red-50/30 shadow-sm dark:border-red-900/50 dark:bg-red-900/10">
                      <CardContent className="pt-4">
                        <p className="mb-2 text-sm text-red-700 dark:text-red-400">
                          These URLs have been flagged for potential
                          inappropriate content. Please review them and take
                          appropriate action.
                        </p>
                      </CardContent>
                    </Card>
                    <UrlsTable
                      urls={categorizedUrls.inappropriate}
                      total={categorizedUrls.inappropriate.length}
                      currentPage={page}
                      currentSearch={search}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      highlightedStyle="inappropriate"
                    />
                  </div>
                )}

              {/* for other */}
              {categorizedUrls?.other && categorizedUrls.other.length > 0 && (
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-2">
                    <AlertTriangle className="size-5 text-yellow-500 dark:text-yellow-300" />
                    <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-400">
                      Other concerns
                    </h3>
                  </div>

                  <Card className="mb-6 border-red-200 bg-yellow-50/30 shadow-sm dark:border-yellow-900/50 dark:bg-yellow-900/10">
                    <CardContent className="pt-4">
                      <p className="mb-2 text-sm text-yellow-700 dark:text-yellow-400">
                        These URLs have been flagged for potential inappropriate
                        content. Please review them and take appropriate action.
                      </p>
                    </CardContent>
                  </Card>
                  <UrlsTable
                    urls={categorizedUrls.other}
                    total={categorizedUrls.other.length}
                    currentPage={page}
                    currentSearch={search}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    highlightedStyle="other"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
