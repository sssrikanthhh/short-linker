import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminSidebar from "@/components/admin/admin-sidebar";
import Header from "@/components/layout/header";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <section className="flex min-h-screen flex-col pt-6">
      <div className="flex w-full flex-1">
        <AdminSidebar />
        <main className="ml-0 flex flex-1 justify-center overflow-auto md:ml-64">
          <div className="container px-4 py-6 md:px-6 md:py-8">{children}</div>
        </main>
      </div>
    </section>
  );
}
