import { AiringSchedule } from "@/components/airing-schedule";
import { BookmarkCard } from "@/components/bookmark-card";
import { GenreRow } from "@/components/genre-row";
import { HeroCarousel, type HeroSlide } from "@/components/hero-carousel";
import { HomeFeed } from "@/components/home-feed";
import { SideList } from "@/components/side-list";
import {
  airedEpisodes,
  displayTitle,
  formatLabel,
  getList,
  releaseYear,
  type ListResult,
  type Media,
} from "@/lib/anilist";
import { getLogo } from "@/lib/tmdb";

export const revalidate = 300;

const empty: ListResult = { media: [], hasNextPage: false, currentPage: 1 };
const safe = <T,>(p: Promise<T>, fallback: T) => p.catch(() => fallback);

async function toSlide(m: Media): Promise<HeroSlide> {
  const logo = await getLogo([m.title.english, m.title.romaji], releaseYear(m), m.format);
  return {
    id: m.id,
    title: displayTitle(m),
    logo,
    banner: m.bannerImage,
    cover: m.coverImage.extraLarge ?? m.coverImage.large ?? "",
    format: formatLabel(m.format),
    cc: airedEpisodes(m),
    score: m.averageScore,
    current: m.nextAiringEpisode ? m.nextAiringEpisode.episode : (m.episodes ?? 1),
    total: m.episodes,
    airing: m.status === "RELEASING",
    color: m.coverImage.color,
  };
}

export default async function Home() {
  // Fired in parallel; each is cached by Next so AniList is hit rarely.
  const [trending, newest, airing, upcoming] = await Promise.all([
    safe(getList({ sort: ["TRENDING_DESC"], status: "RELEASING", perPage: 8 }), empty),
    safe(getList({ sort: ["UPDATED_AT_DESC"], status: "RELEASING", perPage: 18 }), empty),
    safe(getList({ sort: ["POPULARITY_DESC"], status: "RELEASING", perPage: 10 }), empty),
    safe(getList({ sort: ["POPULARITY_DESC"], status: "NOT_YET_RELEASED", perPage: 10 }), empty),
  ]);

  const heroMedia = trending.media.filter((m) => m.coverImage.extraLarge).slice(0, 6);
  const slides = await Promise.all(heroMedia.map(toSlide));

  return (
    <div className="space-y-6 pb-4">
      <HeroCarousel slides={slides} />
      <GenreRow />
      <BookmarkCard />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="min-w-0 space-y-10">
          <HomeFeed initial={newest} />
          <AiringSchedule />
        </div>
        <aside className="space-y-6">
          <SideList title="Top Airing" kind="airing" media={airing.media} />
          <SideList title="Upcoming" kind="upcoming" media={upcoming.media} />
        </aside>
      </div>
    </div>
  );
}
