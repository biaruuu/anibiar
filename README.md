# Anibiar

Anime browsing web app in the Miruro dark ("onyx") style. Next.js 15 (App Router), Tailwind + shadcn/ui-style components, Karla font.

- **Data:** AniList GraphQL (`graphql.anilist.co`). Every query is cached with Next's data cache (5-10 min) and 429s are retried, so normal traffic stays well under AniList's 90 req/min limit.
- **Logos:** TMDB `/images` endpoint (title logos on the hero and detail pages). Falls back to a gold text title if no logo or no key.
- **Pages:** `/` home, `/anime/[id]`, `/watch/[id]`, `/search`, `/schedule`.

## Run

```bash
npm install
cp .env.example .env.local   # add TMDB_API_KEY
npm run dev
```

## Deploy to Vercel

Import the repo, add the env var `TMDB_API_KEY` (v3 key or v4 read token), deploy.

## Notes

- Anibiar does not host or embed pirated streams. The watch page shows the AniList trailer and links to official streaming services.
- Pixel-matching Miruro and identical data are best effort: Miruro uses its own backend and episode counts (sub/dub) which AniList does not expose.
