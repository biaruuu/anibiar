"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimeGrid, gridClass } from "@/components/anime-grid";
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
  const userNavigated = useRef(false);

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

  // Only scroll back up after the person actually pressed next/prev - never on load.
  useEffect(() => {
    if (!userNavigated.current) return;
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  const changeTab = (id: TabId) => {
    if (id === tab) return;
    setTab(id);
    setPage(1);
  };
  const changePage = (p: number) => {
    userNavigated.current = true;
    setPage(p);
  };

  return (
    <div ref={top} className="scroll-mt-[72px]">
      <div className="mb-[14px] flex items-center gap-[6px] md:mb-5 md:gap-3">
        {/* tabs */}
        <div className="no-scrollbar flex h-[34px] min-w-0 flex-1 overflow-x-auto rounded-xl border border-[#2a2a2e] bg-[#0e0e0f] md:h-[52px] md:rounded-2xl">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTab(t.id)}
              className={cn(
                "h-full flex-1 whitespace-nowrap px-2 text-[14px] font-medium transition-colors md:text-lg md:font-bold",
                tab === t.id
                  ? "bg-primary/[0.17] text-primary"
                  : "text-foreground hover:bg-white/5",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* pagination */}
        <div className="flex h-[34px] w-[116px] shrink-0 items-center overflow-hidden rounded-xl border border-[#2a2a2e] md:h-[52px] md:w-[150px] md:rounded-2xl">
          <button
            aria-label="Previous page"
            disabled={page <= 1 || loading}
            onClick={() => changePage(page - 1)}
            className="grid h-full w-[38px] place-items-center text-foreground transition hover:bg-white/5 disabled:text-[#55555b] md:w-12"
          >
            <ChevronLeft className="size-[18px]" />
          </button>
          <span className="flex-1 text-center text-[14px] text-[#77777f] md:text-lg">{page}</span>
          <button
            aria-label="Next page"
            disabled={!data.hasNextPage || loading}
            onClick={() => changePage(page + 1)}
            className="grid h-full w-[38px] place-items-center border-l border-[#2a2a2e] text-foreground transition hover:bg-white/5 disabled:text-[#55555b] md:w-12"
          >
            <ChevronRight className="size-[18px]" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="grid place-items-center rounded-3xl border border-border py-16 text-center text-muted-foreground">
          Couldn&apos;t load anime right now.
          <button className="mt-3 font-bold text-primary" onClick={() => setRetry((n) => n + 1)}>
            Try again
          </button>
        </div>
      ) : loading ? (
        <div className={gridClass}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="aspect-[212/294] rounded-[15px]" />
              <Skeleton className="mt-[11px] h-4 w-4/5" />
              <Skeleton className="mt-[11px] h-[18px] w-3/5" />
            </div>
          ))}
        </div>
      ) : (
        <AnimeGrid media={data.media as Media[]} />
      )}
    </div>
  );
}
