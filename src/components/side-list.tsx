"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronDown, ChevronRight, Megaphone, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
    <section className="rounded-[1.5rem] border border-border p-3 sm:rounded-[2rem] sm:p-4">
      <h2 className="mb-3 flex items-center gap-2 px-2 pt-1 text-lg font-extrabold uppercase tracking-tight sm:mb-4 sm:pt-2 sm:text-2xl">
        {kind === "airing" ? <ChevronRight className="size-6" strokeWidth={3} /> : <Megaphone className="size-6" />}
        {title}
      </h2>
      <ul className="space-y-2.5">
        {shown.map((m) => {
          const t = displayTitle(m);
          const year = releaseYear(m);
          const aired = airedEpisodes(m);
          return (
            <li key={m.id}>
              <Link
                href={`/anime/${m.id}`}
                className="group relative flex items-center gap-4 overflow-hidden rounded-3xl bg-card/70 p-0 pr-4 transition hover:bg-card"
              >
                {m.bannerImage && (
                  <Image
                    src={m.bannerImage}
                    alt=""
                    fill
                    sizes="400px"
                    className="object-cover opacity-[0.12] grayscale mask-image-r"
                    style={{ maskImage: "linear-gradient(to right, transparent 30%, #000)" }}
                  />
                )}
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-20 sm:rounded-2xl">
                  <Image
                    src={m.coverImage.large ?? m.coverImage.extraLarge ?? ""}
                    alt={t}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="relative min-w-0 flex-1 py-3">
                  <div className="flex items-start gap-3">
                    <StatusDot status={m.status} className="mt-2.5" />
                    <h3 className="line-clamp-2 text-[14px] leading-snug transition-colors group-hover:text-primary sm:text-lg">
                      {t}
                    </h3>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 pl-[1.4rem]">
                    <Badge>{formatLabel(m.format)}</Badge>
                    {year && (
                      <Badge>
                        <Calendar className="size-3" />
                        {year}
                      </Badge>
                    )}
                    {kind === "airing" ? (
                      <>
                        {aired > 0 && (
                          <Badge>
                            <CCIcon />
                            {aired}
                          </Badge>
                        )}
                        {m.averageScore ? (
                          <Badge>
                            <Star className="size-3" />
                            {m.averageScore}
                          </Badge>
                        ) : null}
                      </>
                    ) : (
                      m.format === "MOVIE" && <Badge>1 EP</Badge>
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
          className="mt-3 grid h-14 w-full place-items-center rounded-3xl bg-card/70 text-muted-foreground transition hover:bg-card hover:text-foreground"
        >
          <ChevronDown className={cn("size-6 transition-transform", open && "rotate-180")} strokeWidth={3} />
        </button>
      )}
    </section>
  );
}
