import Link from "next/link";
import { Metadata } from "next";
import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Database,
  Link2Icon,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Short Linker | Admin",
  description: "Admin page for Short Linker website",
};

export default function AdminPage() {
  const adminModules = [
    {
      title: "URL Management",
      description: "View, edit and manage all shortened URLs.",
      icon: <Link2Icon className="size-5" />,
      href: "/admin/urls",
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Flagged URLs",
      description: "Review and moderate flagged URLs.",
      icon: <AlertTriangle className="size-5" />,
      href: "/admin/urls/flagged",
      color: "text-yellow-500",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions.",
      icon: <Users className="size-5" />,
      href: "/admin/users",
      color: "text-indigo-500",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
    },
    {
      title: "Database Management",
      description: "Seed and manage the database.",
      icon: <Database className="size-5" />,
      href: "/admin/database",
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-medium tracking-tight">
          Short Linker Admin
        </h1>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {adminModules.map((module) => (
            <Card key={module.href} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`rounded-full p-2 ${module.bgColor} ${module.color}`}
                  >
                    {module.icon}
                  </div>
                  <CardTitle className="text-lg">{module.title}</CardTitle>
                </div>
                <CardDescription>{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="">
                <Link href={module.href}>
                  <Button
                    variant="outline"
                    className="group w-full cursor-pointer justify-between"
                  >
                    Manage {module.title}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="border-t p-4 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Button
            variant="outline"
            className="justify-start gap-2"
            size="sm"
            title="Back to App"
          >
            <ChevronRight className="size-4" />
            Back to App
          </Button>
        </Link>
      </div>
    </>
  );
}
