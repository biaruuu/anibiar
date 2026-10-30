import { Bookmark } from "lucide-react";
import { LogoMark } from "@/components/logo";

export function BookmarkCard() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/40 p-3 sm:gap-4 sm:rounded-3xl sm:p-4">
      <LogoMark className="size-12 shrink-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 text-xl sm:size-[4.5rem] sm:text-3xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-extrabold leading-tight sm:text-xl">Love the Site?</p>
        <p className="truncate text-sm leading-tight text-muted-foreground sm:text-lg">
          Add it to your Bookmarks!
        </p>
      </div>
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary sm:size-14">
        <Bookmark className="size-5 sm:size-6" />
      </span>
    </div>
  );
}
