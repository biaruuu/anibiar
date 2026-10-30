"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronDown, ChevronRight, Megaphone, Star } from "lucide-react";
import { Chip } from "@/components/chip";
import { CCIcon, StatusDot } from "@/components/anime-card";
import { airedEpisodes, displayTitle, formatLabel, releaseYear, type Media } from "@/lib/anilist";
import { cn } from "@/lib/utils";

export function SideList({
  title,
  kind,
  media,
}: {
  title: string;
  kind: "airing" | "upcoming";
  media: Media[];
}) {
  const [open, setOpen] = useState(false);
  const shown = open ? media : media.slice(0, 5);

  return (
    <section className="rounded-[22px] border border-[#2a2a2e] p-3">
      <h2 className="flex items-center gap-2 px-2 pb-[14px] pt-[14px] text-[18px] font-extrabold uppercase leading-none tracking-tight md:text-2xl">
        {kind === "airing" ? (
          <ChevronRight className="size-[18px] md:size-6" strokeWidth={3.5} />
        ) : (
          <Megaphone className="size-[18px] md:size-6" />
        )}
        {title}
      </h2>

      <ul className="space-y-2">
        {shown.map((m) => {
          const t = displayTitle(m);
          const year = releaseYear(m);
          const aired = airedEpisodes(m);
          return (
            <li key={m.id}>
              <Link
                href={`/anime/${m.id}`}
                className="group relative flex h-[95px] items-center overflow-hidden rounded-[18px] bg-[#161617] transition hover:bg-[#1b1b1c]"
              >
                {m.bannerImage && (
                  <Image
                    src={m.bannerImage}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover opacity-[0.13] grayscale"
                    style={{ maskImage: "linear-gradient(to right, transparent 35%, #000)" }}
                  />
                )}
                <div className="relative h-full w-[68px] shrink-0 overflow-hidden rounded-[16px]">
                  <Image
                    src={m.coverImage.large ?? m.coverImage.extraLarge ?? ""}
                    alt={t}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                </div>
                <div className="relative min-w-0 flex-1 px-4">
                  <div className="flex items-center gap-2">
                    <StatusDot status={m.status} />
                    <h3 className="line-clamp-2 text-[16px] font-normal leading-5 transition-colors group-hover:text-primary">
                      {t}
                    </h3>
                  </div>
                  <div className={cn("mt-2.5 flex gap-1.5 overflow-hidden pl-4")}>
                    <Chip>{formatLabel(m.format)}</Chip>
                    {year && (
                      <Chip>
                        <Calendar className="size-3.5" />
                        {year}
                      </Chip>
                    )}
                    {kind === "airing" ? (
                      <>
                        {aired > 0 && (
                          <Chip>
                            <CCIcon className="size-3.5" />
                            {aired}
                          </Chip>
                        )}
                        {m.averageScore ? (
                          <Chip>
                            <Star className="size-3.5" />
                            {m.averageScore}
                          </Chip>
                        ) : null}
                      </>
                    ) : (
                      m.format === "MOVIE" && <Chip>1 EP</Chip>
                    )}
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {media.length > 5 && (
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Show fewer" : "Show more"}
          className="mt-2 grid h-10 w-full place-items-center rounded-[18px] bg-[#161617] text-[#74747c] transition hover:text-foreground"
        >
          <ChevronDown className={cn("size-[18px] transition-transform", open && "rotate-180")} strokeWidth={3.5} />
        </button>
      )}
    </section>
  );
}
