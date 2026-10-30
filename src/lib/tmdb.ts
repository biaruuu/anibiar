const TMDB = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";

type TmdbAuth = { headers: HeadersInit; qs: string };

function auth(): TmdbAuth | null {
  const key = process.env.TMDB_API_KEY;
  if (!key) return null;
  // v4 read-access tokens are JWTs; v3 keys are 32 hex chars.
  return key.startsWith("eyJ")
    ? { headers: { Authorization: `Bearer ${key}`, Accept: "application/json" }, qs: "" }
    : { headers: { Accept: "application/json" }, qs: `&api_key=${key}` };
}

async function tmdb<T>(path: string, a: TmdbAuth): Promise<T | null> {
  const sep = path.includes("?") ? "&" : "?";
  const res = await fetch(`${TMDB}${path}${a.qs ? `${sep}${a.qs.slice(1)}` : ""}`, {
    headers: a.headers,
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

type SearchResult = { results: { id: number }[] };
type Images = { logos: { file_path: string; iso_639_1: string | null; vote_average: number }[] };

/**
 * Looks up a title logo on TMDB (TV for series, movie for films).
 * Returns null when no key is configured or nothing matches, so callers can
 * fall back to a text title.
 */
export async function getLogo(
  titles: (string | null | undefined)[],
  year: number | null,
  format: string | null,
): Promise<string | null> {
  const a = auth();
  if (!a) return null;
  const kind = format === "MOVIE" ? "movie" : "tv";

  try {
    for (const title of titles.filter((t): t is string => !!t)) {
      const yearParam =
        year && kind === "tv" ? `&first_air_date_year=${year}` : year ? `&year=${year}` : "";
      let found = await tmdb<SearchResult>(
        `/search/${kind}?query=${encodeURIComponent(title)}${yearParam}`,
        a,
      );
      // Sequels often start a different year than the franchise: retry without it.
      if (!found?.results?.length) {
        found = await tmdb<SearchResult>(`/search/${kind}?query=${encodeURIComponent(title)}`, a);
      }
      const id = found?.results?.[0]?.id;
      if (!id) continue;

      const images = await tmdb<Images>(
        `/${kind}/${id}/images?include_image_language=en,null`,
        a,
      );
      const logos = images?.logos ?? [];
      if (!logos.length) continue;
      const best =
        [...logos]
          .filter((l) => l.iso_639_1 === "en")
          .sort((x, y) => y.vote_average - x.vote_average)[0] ?? logos[0];
      return `${IMG}${best.file_path}`;
    }
  } catch {
    return null;
  }
  return null;
}
