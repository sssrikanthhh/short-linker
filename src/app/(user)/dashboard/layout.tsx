import { redirect } from "next/navigation";

import { auth } from "@/auth";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <section className="min-h-[calc[100vh-64px-56px">
      <div className="container mx-auto max-w-5xl px-4 py-10 md:px-8">
        {children}
      </div>
    </section>
  );
}
