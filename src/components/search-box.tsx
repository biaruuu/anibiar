"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBox({ initial, genre, sort }: { initial: string; genre: string; sort?: string }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const qs = new URLSearchParams();
        if (value.trim()) qs.set("q", value.trim());
        if (genre) qs.set("genre", genre);
        if (sort) qs.set("sort", sort);
        router.push(`/search${qs.size ? `?${qs}` : ""}`);
      }}
      className="relative"
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        autoFocus={!initial}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search anime..."
        className="pl-12"
        aria-label="Search anime"
      />
    </form>
  );
}
