import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

/*
  Badge primitive styled after Untitled UI: small pill with subtle border.
  Used for eyebrows, availability, and status lines.
*/

type BadgeVariant = "outline" | "solid";

export interface BadgeProps extends ComponentPropsWithoutRef<"span"> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  outline: "border border-fg/15 bg-fg/[0.03] text-muted",
  solid: "bg-fg text-bg",
};

export function Badge({ variant = "outline", className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variantClasses[variant],
        className,
      )}
      {...rest}
    />
  );
}
