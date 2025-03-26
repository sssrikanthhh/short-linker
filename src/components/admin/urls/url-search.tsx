"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UrlSearchProps = {
  initialSearch?: string;
};

export default function UrlSearch({ initialSearch }: UrlSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(initialSearch);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    //reset to frist page when searching
    params.set("page", "1");

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    const newUrl = `${pathname}?${params.toString()}`;

    router.push(newUrl);
  };

  const clearSearch = () => {
    setSearch("");

    const params = new URLSearchParams(searchParams.toString());

    params.delete("search");
    params.set("page", "1");

    const newUrl = `${pathname}?${params.toString()}`;

    router.push(newUrl);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          type="text"
          placeholder="Search URLs"
          value={search || ""}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-7"
        />
        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute top-0 right-0 hover:bg-transparent hover:bg-none"
            title="clear search"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
      <Button>Search</Button>
    </form>
  );
}
