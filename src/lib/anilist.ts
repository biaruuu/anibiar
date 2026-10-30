const ENDPOINT = "https://graphql.anilist.co";

export type Media = {
  id: number;
  title: { romaji: string | null; english: string | null; native: string | null };
  coverImage: { extraLarge: string | null; large: string | null; color: string | null };
  bannerImage: string | null;
  format: string | null;
  status: string | null;
  episodes: number | null;
  seasonYear: number | null;
  startDate: { year: number | null } | null;
  averageScore: number | null;
  genres: string[];
  description: string | null;
  nextAiringEpisode: { episode: number; airingAt: number } | null;
};

export type MediaDetail = Media & {
  duration: number | null;
  source: string | null;
  popularity: number | null;
  season: string | null;
  synonyms: string[];
  trailer: { id: string | null; site: string | null } | null;
  externalLinks: { site: string; url: string; type: string | null }[];
  studios: { nodes: { name: string }[] };
  relations: { edges: { relationType: string; node: Media }[] };
  recommendations: { nodes: { mediaRecommendation: Media | null }[] };
};

export type AiringEntry = {
  id: number;
  episode: number;
  airingAt: number;
  media: { id: number; title: { romaji: string | null; english: string | null }; isAdult: boolean };
};

export type ListResult = { media: Media[]; hasNextPage: boolean; currentPage: number };

const MEDIA_FIELDS = `
  id
  title { romaji english native }
  coverImage { extraLarge large color }
  bannerImage
  format
  status
  episodes
  seasonYear
  startDate { year }
  averageScore
  genres
  description(asHtml: false)
  nextAiringEpisode { episode airingAt }
`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Thin AniList GraphQL client.
 * - Every request is cached by Next's data cache (`revalidate`), so repeated page
 *   views never hit AniList's 90 req/min limit.
 * - 429 responses are retried honouring `Retry-After`.
 */
export async function anilist<T>(
  query: string,
  variables: Record<string, unknown> = {},
  revalidate = 300,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
        next: { revalidate },
      });
      if (res.status === 429) {
        const wait = Number(res.headers.get("retry-after") ?? 2);
        await sleep(Math.min(Math.max(wait, 1), 6) * 1000);
        continue;
      }
      const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
      if (!res.ok || json.errors?.length || !json.data) {
        throw new Error(json.errors?.[0]?.message ?? `AniList request failed (${res.status})`);
      }
      return json.data;
    } catch (err) {
      lastError = err;
      await sleep(400 * (attempt + 1));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("AniList request failed");
}

export type ListOptions = {
  sort?: string[];
  status?: string;
  search?: string;
  genre?: string;
  page?: number;
  perPage?: number;
};

export async function getList(opts: ListOptions = {}, revalidate = 300): Promise<ListResult> {
  const data = await anilist<{
    Page: { pageInfo: { hasNextPage: boolean; currentPage: number }; media: Media[] };
  }>(
    `query ($page: Int, $perPage: Int, $sort: [MediaSort], $status: MediaStatus, $search: String, $genre: String) {
      Page(page: $page, perPage: $perPage) {
        pageInfo { hasNextPage currentPage }
        media(type: ANIME, isAdult: false, sort: $sort, status: $status, search: $search, genre: $genre) {
          ${MEDIA_FIELDS}
        }
      }
    }`,
    {
      page: opts.page ?? 1,
      perPage: opts.perPage ?? 18,
      sort: opts.sort,
      status: opts.status,
      search: opts.search || undefined,
      genre: opts.genre || undefined,
    },
    revalidate,
  );
  return {
    media: data.Page.media,
    hasNextPage: data.Page.pageInfo.hasNextPage,
    currentPage: data.Page.pageInfo.currentPage,
  };
}

export async function getSchedule(start: number, end: number): Promise<AiringEntry[]> {
  const out: AiringEntry[] = [];
  for (let page = 1; page <= 3; page++) {
    const data = await anilist<{
      Page: { pageInfo: { hasNextPage: boolean }; airingSchedules: AiringEntry[] };
    }>(
      `query ($start: Int, $end: Int, $page: Int) {
        Page(page: $page, perPage: 50) {
          pageInfo { hasNextPage }
          airingSchedules(airingAt_greater: $start, airingAt_lesser: $end, sort: TIME) {
            id
            episode
            airingAt
            media { id title { romaji english } isAdult }
          }
        }
      }`,
      { start, end, page },
      600,
    );
    out.push(...data.Page.airingSchedules);
    if (!data.Page.pageInfo.hasNextPage) break;
  }
  return out.filter((e) => !e.media.isAdult);
}

export async function getAnime(id: number): Promise<MediaDetail | null> {
  try {
    const data = await anilist<{ Media: MediaDetail | null }>(
      `query ($id: Int) {
        Media(id: $id, type: ANIME) {
          ${MEDIA_FIELDS}
          duration
          source
          popularity
          season
          synonyms
          trailer { id site }
          externalLinks { site url type }
          studios(isMain: true) { nodes { name } }
          relations {
            edges {
              relationType(version: 2)
              node { ${MEDIA_FIELDS} }
            }
          }
          recommendations(perPage: 12, sort: RATING_DESC) {
            nodes { mediaRecommendation { ${MEDIA_FIELDS} } }
          }
        }
      }`,
      { id },
      600,
    );
    return data.Media;
  } catch {
    return null;
  }
}

/* ---------- helpers ---------- */

export const displayTitle = (m: { title: Media["title"] }) =>
  m.title.english ?? m.title.romaji ?? m.title.native ?? "Untitled";

export const formatLabel = (format: string | null) => {
  switch (format) {
    case "TV":
    case "TV_SHORT":
      return "TV";
    case "MOVIE":
      return "MOVIE";
    case "SPECIAL":
      return "SPECIAL";
    case "MUSIC":
      return "MUSIC";
    default:
      return format ?? "TV";
  }
};

export const releaseYear = (m: Media) => m.seasonYear ?? m.startDate?.year ?? null;

/** Number of episodes that have already aired. */
export const airedEpisodes = (m: Media) => {
  if (m.nextAiringEpisode) return Math.max(m.nextAiringEpisode.episode - 1, 0);
  if (m.status === "NOT_YET_RELEASED") return 0;
  return m.episodes ?? 0;
};

export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mahou Shoujo",
  "Mecha",
  "Music",
  "Mystery",
  "Psychological",
  "Romance",
  "Sci-Fi",
  "Slice of Life",
  "Sports",
  "Supernatural",
  "Thriller",
];

export const SORTS: Record<string, { label: string; sort: string[]; status?: string }> = {
  newest: { label: "Newest", sort: ["UPDATED_AT_DESC"], status: "RELEASING" },
  popular: { label: "Popular", sort: ["POPULARITY_DESC"] },
  top: { label: "Top", sort: ["SCORE_DESC"] },
  trending: { label: "Trending", sort: ["TRENDING_DESC"] },
};
