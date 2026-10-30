"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Play, Star } from "lucide-react";
import { CCIcon } from "@/components/anime-card";
import { cn } from "@/lib/utils";

export type HeroSlide = {
  id: number;
  title: string;
  logo: string | null;
  banner: string | null;
  cover: string;
  format: string;
  cc: number;
  score: number | null;
  current: number;
  total: number | null;
  airing: boolean;
  /** Light colour taken from the anime's own cover - used for the title. */
  titleColor: string;
  /** Dark colour taken from the anime's own cover - used behind the pills. */
  tint: string;
};

const glass = "bg-black/40 backdrop-blur-md";

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  const go = (d: 1 | -1) => setIndex((i) => (i + d + slides.length) % slides.length);

  return (
    <section
      className="relative mt-[2px] aspect-[43/50] overflow-hidden rounded-[24px] border border-white/[0.06] bg-card sm:aspect-[16/10] md:aspect-auto md:h-[480px] md:rounded-[28px] lg:h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        setPaused(true);
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        setPaused(false);
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const pill = { background: `linear-gradient(100deg, ${s.tint}, rgba(12,12,12,0.55))` };
        return (
          <div
            key={s.id}
            aria-hidden={!active}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              active ? "z-10 opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <Image
              src={s.cover}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-top md:hidden"
            />
            <Image
              src={s.banner ?? s.cover}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="hidden object-cover object-center md:block"
            />
            {/* clear on top, fades to black behind the text */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,.96) 0%, rgba(0,0,0,.72) 26%, rgba(0,0,0,.18) 48%, rgba(0,0,0,0) 62%)",
              }}
            />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/60 via-transparent to-transparent md:block" />

            {/* top pills */}
            <div className="absolute inset-x-4 top-4 flex items-start justify-between md:inset-x-8 md:top-8">
              <span
                className="flex h-[38px] items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 text-[15px] font-bold backdrop-blur-md md:h-12 md:gap-2 md:px-4 md:text-xl"
                style={pill}
              >
                <Clock className="size-[18px] md:size-5" />
                {s.airing ? `EP ${s.current} Airing Now` : "Featured"}
              </span>
              <span
                className="flex h-[38px] items-center gap-1 rounded-full border border-white/[0.08] px-[14px] font-bold backdrop-blur-md md:h-12 md:px-5"
                style={pill}
              >
                <span className="text-[18px] md:text-xl">{s.current}</span>
                <span className="text-[18px] text-white/80 md:text-xl">/</span>
                <span className="text-[12px] md:text-sm">{s.total ?? "?"}</span>
              </span>
            </div>

            {/* bottom content */}
            <div className="absolute inset-x-4 bottom-3 flex flex-col items-center gap-[7px] md:inset-x-10 md:bottom-10 md:items-start md:gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(glass, "inline-flex h-[25px] items-center rounded-full px-3 text-[13px] font-semibold md:h-9 md:px-4 md:text-base")}>
                  {s.format}
                </span>
                {s.cc > 0 && (
                  <span className={cn(glass, "inline-flex h-[25px] items-center gap-1 rounded-full px-2.5 text-[13px] font-semibold md:h-9 md:px-4 md:text-base")}>
                    <CCIcon className="size-[15px]" />
                    {s.cc}
                  </span>
                )}
                {s.score ? (
                  <span className={cn(glass, "inline-flex h-[25px] items-center gap-1 rounded-full px-2.5 text-[13px] font-semibold md:h-9 md:px-4 md:text-base")}>
                    <Star className="size-[14px]" />
                    {s.score}
                  </span>
                ) : null}
              </div>

              {s.logo ? (
                <>
                  <h2 className="sr-only">{s.title}</h2>
                  <Image
                    src={s.logo}
                    alt={s.title}
                    width={500}
                    height={200}
                    unoptimized
                    className="max-h-[68px] w-auto max-w-[72%] object-contain drop-shadow-[0_3px_14px_rgba(0,0,0,0.8)] md:max-h-36"
                  />
                </>
              ) : (
                <h2
                  className="line-clamp-3 max-w-[300px] text-balance px-1 text-center text-[22px] font-bold leading-[29px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)] md:max-w-3xl md:text-left md:text-5xl md:leading-[1.1]"
                  style={{ color: s.titleColor }}
                >
                  {s.title}
                </h2>
              )}

              <div className="mt-2.5 flex w-full gap-1 md:mt-1 md:max-w-md">
                <Link
                  href={`/anime/${s.id}`}
                  tabIndex={active ? 0 : -1}
                  className="flex h-[39px] flex-[152] items-center justify-center gap-2 rounded-full border border-white/[0.14] bg-black text-[12px] font-bold transition hover:bg-white/10 md:h-12 md:text-base"
                >
                  <span className="grid size-[17px] place-items-center rounded-full bg-white text-[11px] font-black leading-none text-black">
                    i
                  </span>
                  DETAILS
                </Link>
                <Link
                  href={`/watch/${s.id}?ep=1`}
                  tabIndex={active ? 0 : -1}
                  className="flex h-[39px] flex-[160] items-center justify-center gap-2 rounded-full border-2 border-white/90 bg-black text-[12px] font-bold transition hover:bg-white/10 md:h-12 md:text-base"
                >
                  <span className="grid size-[19px] place-items-center rounded-full bg-white text-black">
                    <Play className="size-[10px] fill-current" />
                  </span>
                  WATCH NOW
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-8 z-20 hidden gap-1.5 md:flex">
          {slides.map((s, i) => (
            <button
              key={s.id}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-primary" : "w-1.5 bg-white/30 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}
