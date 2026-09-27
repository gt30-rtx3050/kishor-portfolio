import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

/*
  Text link with an arrow that nudges up-right on hover.
  Used for "View all projects" and "Learn More" style affordances.
*/

interface ArrowLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function ArrowLink({ to, children, className }: ArrowLinkProps) {
  return (
    <Link
      to={to}
      className={cn(
        "group inline-flex items-center gap-1.5 text-sm font-medium text-fg/70 transition-colors hover:text-fg",
        className,
      )}
    >
      {children}
      <ArrowUpRightIcon className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}
