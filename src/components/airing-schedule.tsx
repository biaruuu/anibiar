"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiringEntry } from "@/lib/anilist";
import { cn } from "@/lib/utils";

const DAY = 86_400;
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const pad = (n: number) => String(n).padStart(2, "0");

export function AiringSchedule({ initialLimit = 10 }: { initialLimit?: number }) {
  // Dates are computed on the client so they always use the viewer's timezone.
  const [days, setDays] = useState<Date[]>([]);
  const [selected, setSelected] = useState(0);
  const [entries, setEntries] = useState<AiringEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [all, setAll] = useState(false);
  const cache = useRef(new Map<number, AiringEntry[]>());

  useEffect(() => {
    const today = startOfDay(new Date());
    const list = Array.from({ length: 15 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i - 7);
      return d;
    });
    setDays(list);
    setSelected(7);
  }, []);

  const day = days[selected];

  useEffect(() => {
    if (!day) return;
    const start = Math.floor(day.getTime() / 1000);
    const hit = cache.current.get(start);
    setAll(false);
    if (hit) {
      setEntries(hit);
      setError(false);
      return;
    }
    const ctrl = new AbortController();
    setEntries(null);
    setError(false);
    fetch(`/api/schedule?start=${start}&end=${start + DAY}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json: { entries: AiringEntry[] }) => {
        cache.current.set(start, json.entries);
        setEntries(json.entries);
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setError(true);
      });
    return () => ctrl.abort();
  }, [day]);

  const rowsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = rowsRef.current?.children[selected] as HTMLElement | undefined;
    el?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selected, days.length]);

  const nowSec = Math.floor(Date.now() / 1000);
  const visible = useMemo(
    () => (entries ? (all ? entries : entries.slice(0, initialLimit)) : []),
    [entries, all, initialLimit],
  );

  return (
    <section>
      <p className="text-xl text-muted-foreground">Estimated</p>
      <h2 className="text-4xl font-extrabold tracking-tight">Airing Schedule</h2>

      <div
        ref={rowsRef}
        className="no-scrollbar edge-fade-x mt-6 flex items-end gap-1 overflow-x-auto py-3"
      >
        {days.map((d, i) => {
          const active = i === selected;
          return (
            <div key={d.toISOString()} className="flex shrink-0 items-end">
              <span className="px-3 text-3xl font-extrabold text-white/20">/</span>
              <button
                onClick={() => setSelected(i)}
                className={cn(
                  "flex flex-col items-center leading-none transition-all duration-300",
                  active ? "text-foreground" : "text-white/35 hover:text-white/60",
                )}
              >
                <span className={cn("font-extrabold", active ? "text-5xl" : "text-4xl")}>
                  {DAYS[d.getDay()]}
                </span>
                {active && (
                  <span className="mt-1 text-xl text-muted-foreground">
                    {MONTHS[d.getMonth()]} {d.getDate()}
                  </span>
                )}
              </button>
            </div>
          );
        })}
        <span className="px-3 text-3xl font-extrabold text-white/20">/</span>
      </div>

      <div className="mt-4 overflow-hidden rounded-[1.75rem] border border-border bg-card/40">
        {error ? (
          <p className="p-8 text-center text-muted-foreground">Couldn&apos;t load the schedule.</p>
        ) : !entries ? (
          <div className="space-y-px">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[52px] rounded-none" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">Nothing scheduled for this day.</p>
        ) : (
          <>
            <ul className="divide-y divide-border">
              {visible.map((e, i) => {
                const t = new Date(e.airingAt * 1000);
                const time = `${pad(t.getHours())}:${pad(t.getMinutes())}`;
                const prev = visible[i - 1];
                const prevTime = prev ? new Date(prev.airingAt * 1000) : null;
                const sameTime = prevTime && pad(prevTime.getHours()) + pad(prevTime.getMinutes()) === pad(t.getHours()) + pad(t.getMinutes());
                const aired = e.airingAt <= nowSec;
                return (
                  <li key={e.id} className={cn(i % 2 === 1 && "bg-white/[0.02]")}>
                    <Link
                      href={`/anime/${e.media.id}`}
                      className={cn(
                        "relative flex items-center gap-4 px-5 py-3.5 transition hover:bg-white/5",
                        aired && "before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-primary/70",
                      )}
                    >
                      <span className="w-14 shrink-0 text-base text-muted-foreground">
                        {sameTime ? "" : time}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-lg">
                        {e.media.title.english ?? e.media.title.romaji}
                      </span>
                      <span className="shrink-0 rounded-full border border-border px-3.5 py-1.5 text-base">
                        EP {e.episode}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {entries.length > initialLimit && (
              <button
                onClick={() => setAll((v) => !v)}
                className="w-full border-t border-border py-4 text-lg text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {all ? "Show Less" : "View More"}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
