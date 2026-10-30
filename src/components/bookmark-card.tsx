import { Bookmark } from "lucide-react";
import { LogoMark } from "@/components/logo";

export function BookmarkCard() {
  return (
    <div className="flex h-[66px] items-center gap-2 rounded-2xl border border-[#2a2a2e] px-[13px] md:h-[84px] md:gap-4 md:px-5">
      <LogoMark className="size-[37px] shrink-0 rounded-full bg-gradient-to-br from-primary/50 to-primary/10 text-[17px] md:size-[52px] md:text-2xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-extrabold leading-5 md:text-xl">Love the Site?</p>
        <p className="truncate text-[13px] leading-[18px] text-[#6e6e76] md:text-base">
          Add it to your Bookmarks!
        </p>
      </div>
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/[0.14] text-primary md:size-10">
        <Bookmark className="size-4 md:size-5" />
      </span>
    </div>
  );
}
