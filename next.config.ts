import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve AniList / TMDB images straight from their CDNs so the app never
    // runs into Vercel's image-optimization quotas.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**.anilist.co" },
      { protocol: "https", hostname: "image.tmdb.org" },
    ],
  },
};

export default nextConfig;
