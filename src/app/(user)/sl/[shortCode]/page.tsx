import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";

import { getUrlByShortCode } from "@/actions/url/get-url";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Redirecting...",
  description: "Redirecting to the original URL...",
};

type Params = Promise<{ shortCode: string }>;

export default async function RedirectPage({ params }: { params: Params }) {
  const { shortCode } = await params;

  const response = await getUrlByShortCode(shortCode);
  if (response.success && response.data) {
    if (response?.data?.flagged) {
      return (
        <div className="flex h-[calc(100vh-64px)] items-center justify-center px-4">
          <div className="mx-auto w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <AlertTriangle className="size-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            <h1 className="mb-4 text-xl font-medium text-yellow-600 dark:text-yellow-400">
              Caution: Flagged URL
            </h1>

            <p className="text-muted-foreground mb-2">
              This URL is marked for review regarding its safety concerns and
              will be reviewed by the administrator, before it becomes fully
              accessible.
            </p>

            {response.data.flagReason && (
              <p className="mb-6 rounded-md bg-yellow-100 p-3 text-sm text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                Reason: {response.data.flagReason}
              </p>
            )}

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button variant="outline" asChild>
                <Link href="#">
                  <span>Return to Dashboard</span>
                  <LayoutDashboard className="" />
                </Link>
              </Button>
              <Button asChild>
                <Link
                  href={response.data.originalUrl}
                  target="_blank"
                  prefetch={false}
                  rel="noopener noreferrer"
                >
                  <span>Proceed Anyway</span>
                  <ExternalLink className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    redirect(response.data.originalUrl);
  }
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center px-4">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-destructive/20 flex size-16 items-center justify-center rounded-full">
            <AlertTriangle className="text-destructive size-8" />
          </div>
        </div>

        <h1 className="text-destructive mb-4 text-xl font-medium">
          URL not found.
        </h1>

        <p className="text-muted-foreground mb-6">
          The URL you are trying to access does not exist. It may be removed due
          to safety concerns.
        </p>

        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="size-4" />
            <span>Return to Dashboard</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
