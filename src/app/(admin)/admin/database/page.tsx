import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowLeft,
  DatabaseIcon,
  RefreshCcw,
} from "lucide-react";
import { SeedDatabaseButton } from "@/components/admin/seed-database-button";

export const metadata: Metadata = {
  title: "Short Linker | Admin | Database",
  description: "Admin page for seeding test data to database",
};

export default function DatabasePage() {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Database Management
        </h1>
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
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-purple-100 p-2 text-purple-500 dark:bg-purple-900/20">
                <DatabaseIcon className="size-5" />
              </div>

              <CardTitle>Seed Database</CardTitle>
            </div>
            <CardDescription>
              Seed the database with test data for development and testing
              purposes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
                <AlertTriangle className="mt-1 size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="mb-1 font-medium text-amber-800 dark:text-amber-300">
                  Development use only
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  This tool is intended for development and testing purpose
                  only. Seeding the database will create test users, URLs and
                  other
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-md p-4">
              <h3 className="mb-2 flex items-center gap-2 font-medium">
                <RefreshCcw className="size-4" />
                Seed Database with test data
              </h3>
              <p className="text-muted-foregrounds mb-4 text-sm">
                This will create test users including an admin
                user(admin@gmail.com/admin123), sample URLs and other test data
                needed for development and testing.
              </p>
              <SeedDatabaseButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
