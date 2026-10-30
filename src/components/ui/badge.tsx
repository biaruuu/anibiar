import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold leading-none whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-white/5 text-muted-foreground",
        glass: "bg-black/40 text-foreground backdrop-blur-md border border-white/10",
        outline: "border border-border text-foreground",
        primary: "bg-primary/15 text-primary",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
