"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GetAllUrlsParams } from "@/lib/types";
import { AlertTriangle, Flag, Link, Shield } from "lucide-react";

type UrlFilterProps = {
  initialFilter?: GetAllUrlsParams["filterBy"];
};

export default function UrlFilter({ initialFilter }: UrlFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createQueryString = useCallback(
    (name: string, value: UrlFilterProps["initialFilter"]) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", "1");
      params.set(name, value as string);

      return params.toString();
    },
    [searchParams],
  );

  const handleFilterChange = (filter: UrlFilterProps["initialFilter"]) => {
    const queryString = createQueryString("filterBy", filter);
    const url = `${pathname}?${queryString}`;
    router.push(url);
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <Button
        variant={initialFilter === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => handleFilterChange("all")}
        className="gap-1"
      >
        <Link className="size-4" />
        All
      </Button>
      <Button
        variant={initialFilter === "flagged" ? "default" : "outline"}
        size="sm"
        onClick={() => handleFilterChange("flagged")}
        className="gap-1"
      >
        <Flag className="size-4" />
        Flagged
      </Button>
      <Button
        variant={initialFilter === "security" ? "default" : "outline"}
        size="sm"
        onClick={() => handleFilterChange("security")}
        className="gap-1 text-red-600 dark:text-red-400"
      >
        <Shield className="size-4" />
        Security Risks
      </Button>
      <Button
        variant={initialFilter === "inappropriate" ? "default" : "outline"}
        size="sm"
        onClick={() => handleFilterChange("inappropriate")}
        className="gap-1 text-orange-600 dark:text-orange-400"
      >
        <AlertTriangle />
        Inappropriate
      </Button>
      <Button
        variant={initialFilter === "other" ? "default" : "outline"}
        size="sm"
        onClick={() => handleFilterChange("other")}
        className="gap-2 text-yellow-600 dark:text-yellow-400"
      >
        Other flags
      </Button>
    </div>
  );
}
