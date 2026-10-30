import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeGrid } from "@/components/anime-grid";
import { SearchBox } from "@/components/search-box";
import { GENRES, getList, SORTS, type ListResult } from "@/lib/anilist";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Search" };

type SP = Promise<{ q?: string; genre?: string; sort?: string; page?: string }>;

const href = (p: Record<string, string | number | undefined>) => {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(p)) if (v !== undefined && v !== "" && v !== 1) qs.set(k, String(v));
  const s = qs.toString();
  return s ? `/search?${s}` : "/search";
};

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const genre = sp.genre ?? "";
  const sortKey = sp.sort && SORTS[sp.sort] ? sp.sort : q ? "popular" : "trending";
  const page = Math.max(Number(sp.page) || 1, 1);

  let result: ListResult = { media: [], hasNextPage: false, currentPage: page };
  let failed = false;
  try {
    result = await getList(
      { search: q, genre, sort: q ? undefined : SORTS[sortKey].sort, page, perPage: 24 },
      300,
    );
  } catch {
    failed = true;
  }

  return (
    <div className="space-y-6 pb-4 pt-2">
      <SearchBox initial={q} genre={genre} sort={sp.sort} />

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {Object.entries(SORTS).map(([key, s]) => (
          <Link
            key={key}
            href={href({ q, genre, sort: key })}
            className={cn(
              "shrink-0 rounded-full px-5 py-2.5 text-base font-bold transition",
              sortKey === key && !q ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-white/10",
            )}
          >
            {s.label}
          </Link>
        ))}
      </div>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {GENRES.map((g) => (
          <Link
            key={g}
            href={href({ q, genre: g === genre ? undefined : g, sort: sp.sort })}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition",
              g === genre
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {g}
          </Link>
        ))}
      </div>

      {failed ? (
        <p className="py-20 text-center text-muted-foreground">Couldn&apos;t reach AniList. Please try again.</p>
      ) : result.media.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No results found.</p>
      ) : (
        <AnimeGrid media={result.media} wide />
      )}

      <div className="flex items-center justify-center gap-3">
        {page > 1 && (
          <Link
            href={href({ q, genre, sort: sp.sort, page: page - 1 })}
            className="flex items-center gap-1 rounded-full bg-card px-5 py-2.5 font-bold hover:bg-white/10"
          >
            <ChevronLeft className="size-4" /> Prev
          </Link>
        )}
        <span className="text-muted-foreground">Page {page}</span>
        {result.hasNextPage && (
          <Link
            href={href({ q, genre, sort: sp.sort, page: page + 1 })}
            className="flex items-center gap-1 rounded-full bg-card px-5 py-2.5 font-bold hover:bg-white/10"
          >
            Next <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
