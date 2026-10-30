import { Bookmark } from "lucide-react";
import { LogoMark } from "@/components/logo";

export function BookmarkCard() {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/40 p-4">
      <LogoMark className="size-[4.5rem] shrink-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 text-3xl" />
      <div className="min-w-0 flex-1">
        <p className="text-xl font-extrabold">Love the Site?</p>
        <p className="text-lg text-muted-foreground">Add it to your Bookmarks!</p>
      </div>
      <span className="grid size-14 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
        <Bookmark className="size-6" />
      </span>
    </div>
  );
}
