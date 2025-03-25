"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import { getNavItems, NavItem } from "./nav-items";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const navItems = getNavItems();

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href;
    }
    if (
      item.href === "/admin/urls" &&
      pathname.includes("/admin/urls/flagged")
    ) {
      return false;
    }
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <div className="bg-muted/40 hidden border-r md:fixed md:inset-y-0 md:z-30 md:flex md:w-64 md:flex-col md:pt-14">
      <div className="flex h-14 items-center border-b px-4">
        <h2 className="text-lg font-medium">Admin Dashboard</h2>
      </div>

      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                  isActive(item)
                    ? "bg-primary text-primary-foreground"
                    : "hover: bg-muted",
                )}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            size="sm"
            title="Back to App"
          >
            <ChevronRight className="size-4" />
            Back to App
          </Button>
        </Link>
      </div>
    </div>
  );
}
