import Link from "next/link";
import { LogoMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto w-full max-w-[1500px] px-5 py-10">
        <LogoMark className="size-16 text-3xl" />
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          This website does not host or retain any media files. It only displays anime metadata
          provided by AniList and artwork provided by TMDB.
        </p>
        <nav className="mt-6 flex flex-col gap-3 text-base text-muted-foreground sm:flex-row sm:gap-8 sm:text-lg">
          <Link href="/search?sort=trending" className="transition hover:text-foreground">
            Trending
          </Link>
          <Link href="/search" className="transition hover:text-foreground">
            Search
          </Link>
          <Link href="/schedule" className="transition hover:text-foreground">
            Schedule
          </Link>
        </nav>
        <div className="mt-8 border-t border-border pt-6 text-muted-foreground">
          <p>
            © 2026 <span className="underline underline-offset-4">anibiar</span> | Website by{" "}
            <span className="font-bold text-foreground">Biar</span>
          </p>
          <span className="mt-4 inline-block rounded-full border border-border bg-card/70 px-3 py-1 font-mono text-sm font-bold text-foreground">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
