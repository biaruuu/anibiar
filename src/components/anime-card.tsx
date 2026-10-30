import Image from "next/image";
import Link from "next/link";
import { Mic } from "lucide-react";
import { Chip } from "@/components/chip";
import { airedEpisodes, displayTitle, formatLabel, releaseYear, type Media } from "@/lib/anilist";
import { cn } from "@/lib/utils";

export function CCIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-3.5", className)} fill="currentColor" aria-hidden>
      <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM11 11H9.5v-.5h-2v3h2V13H11v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1Zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1Z" />
    </svg>
  );
}

export function StatusDot({ status, className }: { status: string | null; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        status === "RELEASING" && "bg-live shadow-[0_0_6px_#b6f50099]",
        status === "NOT_YET_RELEASED" && "bg-soon",
        status !== "RELEASING" && status !== "NOT_YET_RELEASED" && "bg-zinc-500",
        className,
      )}
    />
  );
}

export function AnimeCard({ media, priority = false }: { media: Media; priority?: boolean }) {
  const title = displayTitle(media);
  const year = releaseYear(media);
  const aired = airedEpisodes(media);
  const cover = media.coverImage.extraLarge ?? media.coverImage.large ?? "";

  return (
    <Link href={`/anime/${media.id}`} className="group block min-w-0">
      {/* Miruro poster ratio: 212 x 294 */}
      <div className="relative aspect-[212/294] overflow-hidden rounded-[15px] bg-muted ring-1 ring-white/[0.06] md:rounded-[18px]">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            sizes="(min-width:1280px) 16vw, (min-width:768px) 22vw, 33vw"
            priority={priority}
            className="object-cover transition duration-500 ease-out group-hover:scale-105"
          />
        )}
      </div>
      <div className="mt-[11px] flex items-center gap-[6px] px-[2px] md:gap-2">
        <StatusDot status={media.status} />
        <h3 className="min-w-0 truncate text-[13px] font-bold leading-4 text-foreground transition-colors group-hover:text-primary md:text-[15px]">
          {title}
        </h3>
      </div>
      <div className="mt-[11px] flex gap-[5px] overflow-hidden px-[2px] md:gap-1.5">
        <Chip size="card">{formatLabel(media.format)}</Chip>
        {year && <Chip size="card">{year}</Chip>}
        {aired > 0 && (
          <Chip size="card">
            <CCIcon className="size-[10px] md:size-3.5" />
            {aired}
          </Chip>
        )}
        {media.averageScore ? (
          <Chip size="card" className="hidden md:inline-flex">
            <Mic className="size-3" />
            {media.averageScore}
          </Chip>
        ) : null}
      </div>
    </Link>
  );
}
