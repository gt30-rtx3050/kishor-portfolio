import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

/*
  Shared template for the pages that ship in the next build (About,
  Projects, Skills, Contact). Routing, layout, and navigation are already
  wired, so each page only needs real content.
*/
interface PlaceholderPageProps {
  title: string;
  blurb: string;
}

export function PlaceholderPage({ title, blurb }: PlaceholderPageProps) {
  return (
    <div className="shell flex min-h-[70vh] flex-col items-center justify-center py-36 text-center">
      <Reveal>
        <Badge>Coming soon</Badge>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-6 font-display text-4xl font-normal tracking-tight text-balance sm:text-5xl md:text-6xl">
          {title}
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="mt-6 max-w-xl font-light leading-relaxed text-fg/60">{blurb}</p>
      </Reveal>
      <Reveal delay={0.3} className="mt-10">
        <Button to="/" variant="secondary" size="lg">
          Back to Home
          <ArrowRightIcon className="size-4" />
        </Button>
      </Reveal>
    </div>
  );
}
