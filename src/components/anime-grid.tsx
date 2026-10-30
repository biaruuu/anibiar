import { AnimeCard } from "@/components/anime-card";
import type { Media } from "@/lib/anilist";
import { cn } from "@/lib/utils";

// 3 posters per row on phones (13px gutter like Miruro), more as the screen grows.
export const gridClass =
  "grid grid-cols-3 gap-x-[13px] gap-y-[14px] sm:grid-cols-4 sm:gap-x-4 sm:gap-y-5 md:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

export function AnimeGrid({
  media,
  className,
  wide = false,
}: {
  media: Media[];
  className?: string;
  /** Use more columns when the grid spans the full page width. */
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        gridClass,
        wide && "lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8",
        className,
      )}
    >
      {media.map((m, i) => (
        <AnimeCard key={m.id} media={m} priority={i < 3} />
      ))}
    </div>
  );
}
