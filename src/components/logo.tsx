import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Anibiar home"
      className={cn("flex shrink-0 select-none items-end gap-[2px]", className)}
    >
      <span className="text-[25px] font-extrabold uppercase leading-none tracking-[-0.02em] text-foreground md:text-[28px]">
        Ani<span className="text-primary">biar</span>
      </span>
      <span className="mb-[1px] rounded-[4px] bg-white/10 px-[3px] text-[8px] font-extrabold leading-[12px] text-foreground">
        TV
      </span>
    </Link>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-2xl bg-primary/15 text-xl font-extrabold text-primary",
        className,
      )}
    >
      A
    </span>
  );
}
