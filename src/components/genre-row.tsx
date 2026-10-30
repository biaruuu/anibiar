"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GENRES } from "@/lib/anilist";

export function GenreRow() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * Math.max(ref.current.clientWidth * 0.7, 200), behavior: "smooth" });

  const arrow =
    "grid size-10 shrink-0 place-items-center rounded-full bg-white text-black transition hover:scale-105 active:scale-95";

  return (
    <div className="flex items-center gap-2">
      <button className={arrow} onClick={() => scroll(-1)} aria-label="Scroll genres left">
        <ChevronLeft className="size-5" strokeWidth={3} />
      </button>
      <div ref={ref} className="no-scrollbar edge-fade-x flex flex-1 gap-3 overflow-x-auto scroll-smooth">
        {GENRES.map((g) => (
          <Link
            key={g}
            href={`/search?genre=${encodeURIComponent(g)}`}
            className="shrink-0 rounded-full bg-card px-7 py-3.5 text-lg font-bold text-foreground transition hover:bg-primary hover:text-primary-foreground"
          >
            {g}
          </Link>
        ))}
      </div>
      <button className={arrow} onClick={() => scroll(1)} aria-label="Scroll genres right">
        <ChevronRight className="size-5" strokeWidth={3} />
      </button>
    </div>
  );
}
