import { Metadata } from "next";
import { prisma } from "@/lib/prisma-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Statistics | ShortLink",
  description: "Statistics about our URL shortener service",
};

export default async function PublicStatsPage() {
  // Get total number of URLs
  const totalUrls = (await prisma.url.count()) || 0;

  // Get total number of clicks
  const {
    _sum: { clicks: totalClicks },
  } = await prisma.url.aggregate({
    _sum: {
      clicks: true,
    },
  });
  console.log(totalClicks);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-2 text-center text-3xl font-bold">
        Service Statistics
      </h1>
      <p className="text-muted-foreground mb-8 text-center">
        General statistics about our URL shortener service
      </p>

      <div className="mb-8 grid gap-8 md:grid-cols-2">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total URLs Shortened</CardTitle>
            <CardDescription>
              Number of URLs shortened with our service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalUrls.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Clicks</CardTitle>
            <CardDescription>
              Total number of redirects through our service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {totalClicks?.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle>You can track your own statistics</CardTitle>
            <CardDescription>
              Click the button to check your own statistics.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/dashboard">go to dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/my-stats">check my stats</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
