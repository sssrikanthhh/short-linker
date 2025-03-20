import { Metadata } from "next";

import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UrlForm from "@/components/url/url-form";
import { getUserUrls } from "@/actions/url/get-user-urls";
import UserUrlsTable from "@/components/url/user-urls-table";

export const metadata: Metadata = {
  title: "Short Linker | Dashboard",
  description: "User dashboard page for Short Linker",
};

export default async function DashboardPage() {
  const session = await auth();

  //get user urls
  const response = await getUserUrls(session?.user?.id as string);
  const userUrls = (response.success && response.data?.userUrls) || [];

  return (
    <>
      <h1 className="mb-8 text-center text-3xl font-medium">Dashboard</h1>

      <div className="grid gap-8">
        {/* dashboard - create short link */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Create a new short link</CardTitle>
            <CardDescription>
              Enter a long URL and get a short link to share and customize the
              link with your own short code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlForm />
          </CardContent>
        </Card>

        {/* dashboard - list of user created short links */}
        <Card className="border border-dashed shadow-sm">
          <CardHeader>
            <CardTitle>Your short links</CardTitle>
            <CardDescription>
              Manage and track your short links, view click statistics, and
              customize your links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserUrlsTable urls={userUrls} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
