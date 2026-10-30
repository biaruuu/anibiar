import Image from "next/image";
import Link from "next/link";
import { Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        "inline-block size-2.5 shrink-0 rounded-full",
        status === "RELEASING" && "bg-live shadow-[0_0_8px_#b6f500aa]",
        status === "NOT_YET_RELEASED" && "bg-soon",
        status !== "RELEASING" && status !== "NOT_YET_RELEASED" && "bg-zinc-500",
        className,
      )}
    />
  );
}

// Compact on phones so TYPE / YEAR / EPISODES always fit under a 3-per-row card.
const chip = "gap-0.5 px-1.5 py-[3px] text-[9.5px] sm:gap-1 sm:px-2.5 sm:py-1 sm:text-[11px]";

export function AnimeCard({ media, priority = false }: { media: Media; priority?: boolean }) {
  const title = displayTitle(media);
  const year = releaseYear(media);
  const aired = airedEpisodes(media);
  const cover = media.coverImage.extraLarge ?? media.coverImage.large ?? "";

  return (
    <Link href={`/anime/${media.id}`} className="group block min-w-0">
      <div className="relative aspect-[2/3] overflow-hidden rounded-[1.1rem] bg-muted ring-1 ring-white/5 sm:rounded-[1.4rem]">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="mt-2 flex items-center gap-1.5 px-0.5 sm:mt-3 sm:gap-2 sm:px-1">
        <StatusDot status={media.status} className="size-2 sm:size-2.5" />
        <h3 className="min-w-0 truncate text-[12px] font-bold leading-tight text-foreground transition-colors group-hover:text-primary sm:text-[15px]">
          {title}
        </h3>
      </div>
      <div className="mt-1.5 flex gap-1 overflow-hidden px-0.5 sm:mt-2 sm:gap-1.5 sm:px-1">
        <Badge className={chip}>{formatLabel(media.format)}</Badge>
        {year && <Badge className={chip}>{year}</Badge>}
        {aired > 0 && (
          <Badge className={chip}>
            <CCIcon className="size-2.5 sm:size-3.5" />
            {aired}
          </Badge>
        )}
        {media.averageScore ? (
          <Badge className={cn(chip, "hidden md:inline-flex")}>
            <Mic className="size-3" />
            {media.averageScore}
          </Badge>
        ) : null}
      </div>
    </Link>
  );
}
