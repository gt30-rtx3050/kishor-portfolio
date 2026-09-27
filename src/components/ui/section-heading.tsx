import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/animate-ui/text-reveal";
import { ArrowLink } from "@/components/ui/arrow-link";
import { cn } from "@/lib/utils";

/*
  Consistent section header: eyebrow badge, display heading (word reveal),
  optional action link on the right for desktop layouts.
*/

interface SectionHeadingProps {
  id?: string;
  eyebrow: string;
  title: string;
  linkTo?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  linkTo,
  linkLabel,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-12 sm:mb-16",
        centered
          ? "flex flex-col items-center text-center"
          : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn(!centered && "max-w-2xl")}>
        <Reveal>
          <Badge>{eyebrow}</Badge>
        </Reveal>
        <h2
          id={id}
          className="mt-5 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl md:text-5xl"
        >
          <TextReveal text={title} />
        </h2>
      </div>
      {linkTo && linkLabel ? (
        <Reveal delay={0.15} className="shrink-0 md:pb-2">
          <ArrowLink to={linkTo}>{linkLabel}</ArrowLink>
        </Reveal>
      ) : null}
    </div>
  );
}
