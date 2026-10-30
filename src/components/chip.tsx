import { cn } from "@/lib/utils";

/**
 * Small grey pill used under cards and in the side lists.
 * "card": 18px tall / 10px text (fits 3 in a 106px card). "list": 20px / 13px.
 */
export function Chip({
  children,
  size = "list",
  className,
}: {
  children: React.ReactNode;
  size?: "card" | "list";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-white/[0.06] font-bold leading-none text-[#6f6f78]",
        size === "card"
          ? "h-[18px] gap-[2px] px-[6px] text-[10px] max-[350px]:px-[4px] max-[350px]:text-[9px] md:h-[22px] md:gap-1 md:px-2.5 md:text-[11px]"
          : "h-5 gap-1 px-[7px] text-[13px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
