import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { airedEpisodes, displayTitle, getAnime } from "@/lib/anilist";
import { cn } from "@/lib/utils";

export const revalidate = 600;

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ep?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await getAnime(Number((await params).id));
  return { title: m ? `Watch ${displayTitle(m)}` : "Watch" };
}

export default async function WatchPage({ params, searchParams }: Props) {
  const id = Number((await params).id);
  const m = Number.isInteger(id) && id > 0 ? await getAnime(id) : null;
  if (!m) notFound();

  const ep = Math.max(Number((await searchParams).ep) || 1, 1);
  const title = displayTitle(m);
  const total = m.episodes ?? airedEpisodes(m);
  const available = Math.max(airedEpisodes(m), 0);
  const episodes = Array.from({ length: Math.min(total, 500) }, (_, i) => i + 1);

  const streaming = m.externalLinks.filter((l) => l.type === "STREAMING");
  const trailer = m.trailer?.site === "youtube" && m.trailer.id ? m.trailer.id : null;

  return (
    <div className="space-y-6 pb-4 pt-2">
      <div>
        <Link href={`/anime/${m.id}`} className="text-sm text-muted-foreground hover:text-foreground">
          ← {title}
        </Link>
        <h1 className="mt-1 text-2xl font-extrabold md:text-3xl">
          {title} <span className="text-muted-foreground">- Episode {ep}</span>
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <div className="relative aspect-video overflow-hidden rounded-[1.75rem] border border-border bg-black">
            {trailer ? (
              <iframe
                title={`${title} trailer`}
                src={`https://www.youtube-nocookie.com/embed/${trailer}`}
                allow="accelerometer; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            ) : (
              <div className="grid size-full place-items-center p-6 text-center text-muted-foreground">
                No trailer is listed for this title.
              </div>
            )}
          </div>

          <div className="rounded-[1.75rem] border border-border p-5">
            <h2 className="text-lg font-extrabold">Where to watch</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Anibiar does not host video. Official streaming services listed on AniList:
            </p>
            {streaming.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {streaming.map((l) => (
                  <Button key={l.url} asChild variant="soft" size="sm">
                    <a href={l.url} target="_blank" rel="noopener noreferrer">
                      {l.site}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No official streaming links listed yet.</p>
            )}
          </div>
        </div>

        <aside className="rounded-[2rem] border border-border p-4">
          <h2 className="mb-3 px-2 text-xl font-extrabold">Episodes</h2>
          {episodes.length ? (
            <div className="grid max-h-[28rem] grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-8 lg:grid-cols-5">
              {episodes.map((n) => (
                <Link
                  key={n}
                  href={`/watch/${m.id}?ep=${n}`}
                  className={cn(
                    "grid h-11 place-items-center rounded-xl text-sm font-bold transition",
                    n === ep ? "bg-primary text-primary-foreground" : "bg-card hover:bg-white/10",
                    n > available && "opacity-40",
                  )}
                >
                  {n}
                </Link>
              ))}
            </div>
          ) : (
            <p className="px-2 text-muted-foreground">No episodes yet.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
