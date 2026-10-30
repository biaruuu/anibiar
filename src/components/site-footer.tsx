import Link from "next/link";
import { LogoMark } from "@/components/logo";

const linkClass = "block py-[7px] text-[16px] text-[#74747c] transition hover:text-foreground";

export function SiteFooter() {
  return (
    <footer className="mt-10 md:mt-16">
      <div className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-6">
        <LogoMark className="size-14 text-[28px]" />
        <p className="mt-5 max-w-xl text-[13px] leading-[16px] text-[#74747c] md:text-sm md:leading-5">
          This website does not host or retain any media files. It only displays anime metadata
          provided by AniList and artwork provided by TMDB.
        </p>
        <nav className="mt-4 flex flex-col sm:flex-row sm:gap-8">
          <Link href="/search?sort=trending" className={linkClass}>
            Trending
          </Link>
          <Link href="/search" className={linkClass}>
            Search
          </Link>
          <Link href="/schedule" className={linkClass}>
            Schedule
          </Link>
        </nav>
        <div className="mt-5 border-t border-[#2a2a2e] pt-5 text-[14px] text-[#74747c]">
          <p>
            © 2026 <span className="underline underline-offset-4">anibiar</span> | Website by{" "}
            <span className="font-bold text-foreground">Biar</span>
          </p>
          <span className="mt-3 inline-block rounded-full border border-[#2a2a2e] bg-card/70 px-3 py-1 font-mono text-[14px] font-bold text-foreground">
            v1.0.0
          </span>
        </div>
      </div>
    </footer>
  );
}
