import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/*
  Button primitive styled after Untitled UI: rounded, quiet, high contrast.
  Palette-safe hover: slight lift plus a soft white glow (primary only).
  Renders a react-router Link when `to` is given, an anchor for `href`
  (external or mailto), otherwise a native button.
*/

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  /** Internal route, e.g. "/projects". */
  to?: string;
  /** External URL or mailto link. */
  href?: string;
}

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap " +
  "transition-[color,background-color,border-color,box-shadow,translate] duration-200 " +
  "hover:-translate-y-0.5 active:translate-y-0";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-fg text-bg hover:bg-fg/90 hover:shadow-[0_8px_36px_rgba(255,255,255,0.25)]",
  secondary:
    "border border-fg/20 bg-fg/[0.02] text-fg hover:border-fg/50 hover:bg-fg/[0.07]",
  ghost: "text-fg/70 hover:text-fg hover:bg-fg/5",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  to,
  href,
  type,
  ...rest
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (to) {
    return (
      <Link to={to} className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a className={classes} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} {...rest}>
      {children}
    </button>
  );
}
