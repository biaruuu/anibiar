import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Anibiar home"
      className={cn("flex items-baseline gap-0.5 select-none", className)}
    >
      <span className="text-[1.75rem] font-extrabold uppercase leading-none tracking-tight text-foreground">
        Ani<span className="text-primary">biar</span>
      </span>
      <span className="rounded-md bg-white/10 px-1 text-[9px] font-extrabold leading-4 text-foreground">
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
