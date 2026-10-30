"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Info, Play, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  color: string | null;
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 8000);
    return () => clearInterval(t);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      className="relative h-[560px] overflow-hidden rounded-[2rem] border border-white/5 bg-card md:h-[520px] lg:h-[600px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const tint = s.color ?? "#7a1f1f";
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
              className={cn("object-cover object-top md:hidden", active && "animate-in fade-in zoom-in-105 duration-[1400ms]")}
            />
            <Image
              src={s.banner ?? s.cover}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="hidden object-cover object-center md:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-transparent to-transparent md:block" />

            {/* top pills */}
            <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 md:inset-x-8 md:top-8">
              <span
                className="flex items-center gap-2.5 rounded-full border border-white/10 px-4 py-2.5 text-lg font-extrabold shadow-lg backdrop-blur-md md:text-xl"
                style={{ background: `linear-gradient(135deg, ${tint}cc, rgba(0,0,0,0.55))` }}
              >
                <Clock className="size-5" />
                {s.airing ? `EP ${s.current} Airing Now` : "Featured"}
              </span>
              <span
                className="rounded-full border border-white/10 px-5 py-2.5 text-xl font-extrabold shadow-lg backdrop-blur-md"
                style={{ background: `linear-gradient(135deg, ${tint}cc, rgba(0,0,0,0.55))` }}
              >
                {s.current} <span className="text-base text-white/70">/</span>{" "}
                <span className="text-sm text-white/80">{s.total ?? "?"}</span>
              </span>
            </div>

            {/* bottom content */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-4 px-4 pb-10 text-center md:items-start md:px-10 md:pb-14 md:text-left">
              <div className="flex items-center gap-2">
                <Badge variant="glass" className="px-3.5 py-2 text-sm">
                  {s.format}
                </Badge>
                {s.cc > 0 && (
                  <Badge variant="glass" className="px-3.5 py-2 text-sm">
                    <CCIcon className="size-4" />
                    {s.cc}
                  </Badge>
                )}
                {s.score ? (
                  <Badge variant="glass" className="px-3.5 py-2 text-sm">
                    <Star className="size-4" />
                    {s.score}
                  </Badge>
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
                    className="max-h-28 w-auto max-w-[78%] object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] md:max-h-36"
                  />
                </>
              ) : (
                <h2 className="max-w-3xl text-balance text-[2.1rem] font-extrabold leading-[1.1] text-gold drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] md:text-5xl">
                  {s.title}
                </h2>
              )}

              <div className="mt-1 grid w-full max-w-xl grid-cols-2 gap-3 md:max-w-md">
                <Button asChild variant="outline" size="lg" className="text-sm md:text-base">
                  <Link href={`/anime/${s.id}`} tabIndex={active ? 0 : -1}>
                    <Info className="size-5" />
                    DETAILS
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-sm md:text-base">
                  <Link href={`/watch/${s.id}?ep=1`} tabIndex={active ? 0 : -1}>
                    <span className="grid size-7 place-items-center rounded-full bg-white text-black">
                      <Play className="size-3.5 fill-current" />
                    </span>
                    WATCH NOW
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        );
      })}

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5">
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
