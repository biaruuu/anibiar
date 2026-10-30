import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, Star } from "lucide-react";
import { AnimeGrid } from "@/components/anime-grid";
import { CCIcon, StatusDot } from "@/components/anime-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { airedEpisodes, displayTitle, formatLabel, getAnime, releaseYear, type Media } from "@/lib/anilist";
import { heroPalette } from "@/lib/color";
import { getLogo } from "@/lib/tmdb";
import { stripHtml } from "@/lib/utils";

export const revalidate = 600;

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params;
  const m = await getAnime(Number(id));
  if (!m) return { title: "Not found" };
  return { title: displayTitle(m), description: stripHtml(m.description).slice(0, 160) };
}

const pretty = (s: string | null) =>
  s ? s.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "-";

export default async function AnimePage({ params }: { params: Params }) {
  const { id } = await params;
  const numeric = Number(id);
  if (!Number.isInteger(numeric) || numeric <= 0) notFound();

  const m = await getAnime(numeric);
  if (!m) notFound();

  const title = displayTitle(m);
  const logo = await getLogo([m.title.english, m.title.romaji], releaseYear(m), m.format);
  const aired = airedEpisodes(m);

  const related = m.relations.edges
    .filter((e) => e.node && ["PREQUEL", "SEQUEL", "PARENT", "SIDE_STORY", "SPIN_OFF", "ALTERNATIVE"].includes(e.relationType))
    .map((e) => e.node as Media);
  const recs = m.recommendations.nodes.map((n) => n.mediaRecommendation).filter((x): x is Media => !!x);

  const facts: [string, string][] = [
    ["Format", formatLabel(m.format)],
    ["Status", pretty(m.status)],
    ["Episodes", m.episodes ? String(m.episodes) : "?"],
    ["Duration", m.duration ? `${m.duration} min` : "-"],
    ["Season", m.season && m.seasonYear ? `${pretty(m.season)} ${m.seasonYear}` : "-"],
    ["Studio", m.studios.nodes[0]?.name ?? "-"],
    ["Source", pretty(m.source)],
  ];

  return (
    <div className="space-y-8 pb-4 pt-2">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-card">
        {(m.bannerImage ?? m.coverImage.extraLarge) && (
          <Image
            src={(m.bannerImage ?? m.coverImage.extraLarge)!}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40 blur-[1px]"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-black/30" />
        <div className="relative flex flex-col gap-6 p-5 pt-24 sm:p-8 sm:pt-32 md:flex-row md:items-end">
          <div className="relative mx-auto aspect-[2/3] w-44 shrink-0 overflow-hidden rounded-[1.6rem] ring-1 ring-white/10 md:mx-0 md:w-56">
            <Image
              src={m.coverImage.extraLarge ?? m.coverImage.large ?? ""}
              alt={title}
              fill
              priority
              sizes="224px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 text-center md:text-left">
            {logo ? (
              <>
                <h1 className="sr-only">{title}</h1>
                <Image
                  src={logo}
                  alt={title}
                  width={500}
                  height={200}
                  unoptimized
                  className="mx-auto max-h-28 w-auto max-w-full object-contain drop-shadow-[0_4px_18px_rgba(0,0,0,0.7)] md:mx-0"
                />
              </>
            ) : (
              <h1
                className="text-balance text-2xl font-bold leading-tight md:text-5xl"
                style={{ color: heroPalette(m.coverImage.color).title }}
              >
                {title}
              </h1>
            )}
            {m.title.romaji && m.title.romaji !== title && (
              <p className="mt-2 text-muted-foreground">{m.title.romaji}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
              <StatusDot status={m.status} />
              <Badge variant="glass">{formatLabel(m.format)}</Badge>
              {releaseYear(m) && <Badge variant="glass">{releaseYear(m)}</Badge>}
              {aired > 0 && (
                <Badge variant="glass">
                  <CCIcon /> {aired}
                </Badge>
              )}
              {m.averageScore ? (
                <Badge variant="glass">
                  <Star className="size-3" /> {m.averageScore}
                </Badge>
              ) : null}
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
              {m.genres.map((g) => (
                <Link key={g} href={`/search?genre=${encodeURIComponent(g)}`}>
                  <Badge variant="outline" className="px-3 py-1.5 hover:border-primary hover:text-primary">
                    {g}
                  </Badge>
                </Link>
              ))}
            </div>
            <div className="mt-6 flex justify-center md:justify-start">
              <Button asChild size="lg" variant="outline" className="min-w-52">
                <Link href={`/watch/${m.id}?ep=1`}>
                  <span className="grid size-7 place-items-center rounded-full bg-white text-black">
                    <Play className="size-3.5 fill-current" />
                  </span>
                  WATCH NOW
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className="rounded-[2rem] border border-border p-6">
          <h2 className="mb-3 text-2xl font-extrabold">Synopsis</h2>
          <p className="whitespace-pre-line text-lg leading-relaxed text-muted-foreground">
            {stripHtml(m.description) || "No synopsis available."}
          </p>
        </section>
        <dl className="divide-y divide-border rounded-[2rem] border border-border px-6 py-2">
          {facts.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-3">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-bold">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-extrabold">Related</h2>
          <AnimeGrid media={related} wide />
        </section>
      )}
      {recs.length > 0 && (
        <section>
          <h2 className="mb-4 text-2xl font-extrabold">You might also like</h2>
          <AnimeGrid media={recs} wide />
        </section>
      )}
    </div>
  );
}
