"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GENRES } from "@/lib/anilist";

export function GenreRow() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    ref.current?.scrollBy({ left: dir * Math.max(ref.current.clientWidth * 0.7, 160), behavior: "smooth" });

  const arrow =
    "grid size-8 shrink-0 place-items-center rounded-full bg-white text-black transition active:scale-95 md:size-10 md:hover:scale-105";

  return (
    <div className="flex items-center gap-2">
      <button className={arrow} onClick={() => scroll(-1)} aria-label="Scroll genres left">
        <ChevronLeft className="size-[18px]" strokeWidth={3} />
      </button>
      <div ref={ref} className="no-scrollbar edge-fade-x flex min-w-0 flex-1 gap-2 overflow-x-auto scroll-smooth">
        {GENRES.map((g) => (
          <Link
            key={g}
            href={`/search?genre=${encodeURIComponent(g)}`}
            className="grid h-[33px] shrink-0 place-items-center rounded-full bg-card px-[26px] text-[15px] font-semibold text-foreground transition hover:bg-primary hover:text-primary-foreground md:h-12 md:px-7 md:text-lg"
          >
            {g}
          </Link>
        ))}
      </div>
      <button className={arrow} onClick={() => scroll(1)} aria-label="Scroll genres right">
        <ChevronRight className="size-[18px]" strokeWidth={3} />
      </button>
    </div>
  );
}
