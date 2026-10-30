"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeGrid } from "@/components/anime-grid";
import { Skeleton } from "@/components/ui/skeleton";
import type { ListResult, Media } from "@/lib/anilist";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "newest", label: "NEWEST" },
  { id: "popular", label: "POPULAR" },
  { id: "top", label: "TOP" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function HomeFeed({ initial }: { initial: ListResult }) {
  const [tab, setTab] = useState<TabId>("newest");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ListResult>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const cache = useRef(new Map<string, ListResult>([["newest:1", initial]]));
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const key = `${tab}:${page}`;
    const hit = cache.current.get(key);
    if (hit) {
      setData(hit);
      setError(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(false);
    fetch(`/api/anime?tab=${tab}&page=${page}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? (r.json() as Promise<ListResult>) : Promise.reject()))
      .then((json) => {
        cache.current.set(key, json);
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        if (e?.name === "AbortError") return;
        setError(true);
        setLoading(false);
      });
    return () => ctrl.abort();
  }, [tab, page, retry]);

  const changeTab = (id: TabId) => {
    if (id === tab) return;
    setTab(id);
    setPage(1);
  };
  const changePage = (p: number) => {
    setPage(p);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={top} className="scroll-mt-24">
      <div className="mb-5 flex items-center gap-3">
        <div className="no-scrollbar flex min-w-0 flex-1 overflow-x-auto rounded-2xl border border-border bg-card/60">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTab(t.id)}
              className={cn(
                "h-[3.25rem] flex-1 whitespace-nowrap px-5 text-lg font-bold transition-colors",
                tab === t.id
                  ? "bg-primary/20 text-primary"
                  : "text-foreground hover:bg-white/5",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex h-[3.25rem] shrink-0 items-center overflow-hidden rounded-2xl border border-border bg-card/60">
          <button
            aria-label="Previous page"
            disabled={page <= 1 || loading}
            onClick={() => changePage(page - 1)}
            className="grid h-full w-11 place-items-center transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronLeft className="size-5" />
          </button>
          <span className="w-9 text-center text-lg text-muted-foreground">{page}</span>
          <button
            aria-label="Next page"
            disabled={!data.hasNextPage || loading}
            onClick={() => changePage(page + 1)}
            className="grid h-full w-11 place-items-center border-l border-border transition hover:bg-white/5 disabled:opacity-30"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="grid place-items-center rounded-3xl border border-border py-16 text-center text-muted-foreground">
          Couldn&apos;t load anime right now.
          <button
            className="mt-3 font-bold text-primary"
            onClick={() => setRetry((n) => n + 1)}
          >
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[2/3] rounded-[1.4rem]" />
              <Skeleton className="mt-3 h-4 w-4/5" />
              <Skeleton className="mt-2 h-5 w-3/5" />
            </div>
          ))}
        </div>
      ) : (
        <AnimeGrid media={data.media as Media[]} />
      )}
    </div>
  );
}
