"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Flame, Home, Menu, Search } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Logo, LogoMark } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search?sort=trending", label: "Trending", icon: Flame },
  { href: "/search", label: "Search", icon: Search },
  { href: "/schedule", label: "Schedule", icon: CalendarDays },
];

const iconButton =
  "grid size-12 place-items-center rounded-2xl border border-border bg-card/70 text-foreground transition hover:bg-card hover:border-white/20";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-transparent bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] w-full max-w-[1500px] items-center gap-3 px-4">
        <Sheet>
          <SheetTrigger className={iconButton} aria-label="Open menu">
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Site navigation</SheetDescription>
            <div className="mb-6 mt-1">
              <Logo />
            </div>
            <nav className="flex flex-col gap-1.5">
              {NAV.map(({ href, label, icon: Icon }) => (
                <SheetClose asChild key={href}>
                  <Link
                    href={href}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-bold text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                  >
                    <Icon className="size-5" />
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label }) => {
            const active = href === "/" ? pathname === "/" : pathname === href.split("?")[0] && !href.includes("sort");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold text-muted-foreground transition hover:bg-white/5 hover:text-foreground",
                  active && "bg-white/5 text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <Link href="/search" className={iconButton} aria-label="Search">
            <Search className="size-5" />
          </Link>
          <Link href="/" className={iconButton} aria-label="Anibiar">
            <LogoMark className="size-full bg-transparent text-lg" />
          </Link>
        </div>
      </div>
    </header>
  );
}
