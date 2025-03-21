"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  BarChart3Icon,
  ChartPie,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Menu,
} from "lucide-react";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  return (
    <header className="border-b">
      <div className="flex items-center justify-between p-4">
        <Link href="/dashboard">
          <h1 className="flex items-center text-xl font-medium tracking-tight">
            <span>Short</span>
            <LinkIcon className="size-6" />
            <span>Linker</span>
          </h1>
        </Link>

        {/* desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild title="Dashboard">
            <Link href="/dashboard" className="flex items-center gap-1">
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild title="Url Stats">
            <Link href="/stats" className="flex items-center gap-1">
              <BarChart3Icon className="size-4" />
              <span>Url Stats</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild title="My Stats">
            <Link href="/stats" className="flex items-center gap-1">
              <ChartPie className="size-4" />
              <span>My Stats</span>
            </Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            title="Logout"
            onClick={() => signOut()}
          >
            <>
              <LogOut className="size-4" />
              <span>Logout</span>
            </>
          </Button>
        </nav>

        {/* mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="">
                <Menu className="size-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col items-center gap-4 p-4 md:hidden">
                <Button variant="ghost" asChild title="Dashboard">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-start gap-2"
                  >
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild title="Url Stats">
                  <Link
                    href="/stats"
                    className="flex w-full items-center justify-start gap-2"
                  >
                    <BarChart3Icon className="size-4" />
                    <span>Url Stats</span>
                  </Link>
                </Button>
                <Button variant="ghost" asChild title="My Stats">
                  <Link
                    href="/stats"
                    className="flex w-full items-center justify-start gap-2"
                  >
                    <ChartPie className="size-4" />
                    <span>My Stats</span>
                  </Link>
                </Button>
                <Button
                  variant="destructive"
                  title="Logout"
                  onClick={() => signOut()}
                  className="w-full"
                >
                  <>
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
