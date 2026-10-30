"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { AiringEntry } from "@/lib/anilist";
import { cn } from "@/lib/utils";

const DAY = 86_400;
const ROW = 42; // px - every schedule row is exactly this tall
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const pad = (n: number) => String(n).padStart(2, "0");
const hhmm = (sec: number) => {
  const t = new Date(sec * 1000);
  return `${pad(t.getHours())}:${pad(t.getMinutes())}`;
};

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
    setDays(
      Array.from({ length: 15 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() + i - 7);
        return d;
      }),
    );
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

  // Center the chosen day by scrolling ONLY the day strip (never the page).
  const stripRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = stripRef.current;
    const el = c?.children[selected] as HTMLElement | undefined;
    if (!c || !el) return;
    c.scrollTo({ left: el.offsetLeft - c.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [selected, days.length]);

  const nowSec = Math.floor(Date.now() / 1000);
  const visible = useMemo(
    () => (entries ? (all ? entries : entries.slice(0, initialLimit)) : []),
    [entries, all, initialLimit],
  );
  const airedRows = visible.filter((e) => e.airingAt <= nowSec).length;

  return (
    <section>
      <p className="text-[15px] leading-none text-[#74747c] md:text-xl">Estimated</p>
      <h2 className="mt-[6px] text-[24px] font-extrabold leading-none tracking-tight md:text-4xl">
        Airing Schedule
      </h2>

      <div
        ref={stripRef}
        className="no-scrollbar edge-fade-x relative -mx-2 mt-[18px] flex items-end overflow-x-auto px-2 py-2 sm:mx-0 sm:px-0"
      >
        {days.map((d, i) => {
          const active = i === selected;
          return (
            <div key={d.toISOString()} className="flex shrink-0 items-end">
              <span className="px-[19px] pb-[2px] text-[34px] font-extrabold leading-none text-white/25 md:px-6 md:text-5xl">
                /
              </span>
              <button
                onClick={() => setSelected(i)}
                className={cn(
                  "flex flex-col items-center font-extrabold leading-none tracking-tight transition-all duration-300",
                  active ? "text-white" : "text-white/35 hover:text-white/60",
                )}
              >
                <span className={active ? "text-[40px] md:text-6xl" : "text-[34px] md:text-5xl"}>
                  {DAYS[d.getDay()]}
                </span>
                {active && (
                  <span className="mt-[2px] text-[15px] font-normal text-[#74747c] md:text-xl">
                    {MONTHS[d.getMonth()]} {d.getDate()}
                  </span>
                )}
              </button>
            </div>
          );
        })}
        <span className="px-[19px] pb-[2px] text-[34px] font-extrabold leading-none text-white/25 md:px-6 md:text-5xl">
          /
        </span>
      </div>

      <div className="relative mt-3 overflow-hidden rounded-[20px] border border-[#2a2a2e] bg-[#0e0e0f]">
        {error ? (
          <p className="p-8 text-center text-muted-foreground">Couldn&apos;t load the schedule.</p>
        ) : !entries ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[42px] rounded-none" />
            ))}
          </div>
        ) : entries.length === 0 ? (
          <p className="p-8 text-center text-[14px] text-muted-foreground">Nothing scheduled for this day.</p>
        ) : (
          <>
            {/* one continuous bar covering everything that has already aired */}
            {airedRows > 0 && (
              <span
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-10 w-[3px] bg-primary/80"
                style={{ height: airedRows * ROW }}
              />
            )}
            <ul>
              {visible.map((e, i) => {
                const prev = visible[i - 1];
                const sameTime = prev && hhmm(prev.airingAt) === hhmm(e.airingAt);
                return (
                  <li key={e.id} className={cn(i % 2 === 1 && "bg-white/[0.035]")}>
                    <Link
                      href={`/anime/${e.media.id}`}
                      className="flex h-[42px] items-center px-[13px] transition hover:bg-white/5 md:h-12 md:px-5"
                    >
                      <span className="w-[60px] shrink-0 text-[13px] text-[#74747c] md:w-20 md:text-base">
                        {sameTime ? "" : hhmm(e.airingAt)}
                      </span>
                      <span className="min-w-0 flex-1 truncate pr-2 text-[14px] md:text-lg">
                        {e.media.title.english ?? e.media.title.romaji}
                      </span>
                      <span className="shrink-0 rounded-full border border-white/[0.14] px-[10px] py-[2px] text-[13px] leading-[18px] md:px-3.5 md:text-base">
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
                className="h-[42px] w-full border-t border-[#2a2a2e] text-[14px] text-[#74747c] transition hover:bg-white/5 hover:text-foreground md:h-12 md:text-lg"
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
