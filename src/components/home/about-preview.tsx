import { aboutPreview } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/animate-ui/text-reveal";
import { ArrowRightIcon } from "@/components/ui/icons";

export function AboutPreview() {
  return (
    <section aria-labelledby="about-heading" className="border-t border-fg/10">
      <div className="shell grid items-center gap-14 py-24 sm:py-28 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20 lg:py-32">
        {/* Portrait with a soft offset frame. Photo is a labeled placeholder. */}
        <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-none">
          <div aria-hidden="true" className="absolute -inset-3 rounded-3xl border border-fg/15" />
          <div className="relative overflow-hidden rounded-2xl border border-fg/20">
            <img
              src={aboutPreview.image}
              alt={aboutPreview.imageAlt}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover grayscale transition-transform duration-700 ease-out hover:scale-[1.03]"
            />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Badge>{aboutPreview.eyebrow}</Badge>
          </Reveal>
          <h2
            id="about-heading"
            className="mt-5 font-display text-3xl font-normal tracking-tight text-balance sm:text-4xl md:text-5xl"
          >
            <TextReveal text={aboutPreview.heading} />
          </h2>
          {aboutPreview.paragraphs.map((paragraph) => (
            <Reveal key={paragraph.slice(0, 24)}>
              <p className="mt-5 font-light leading-relaxed text-fg/65">{paragraph}</p>
            </Reveal>
          ))}

          <Reveal>
            <dl className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {aboutPreview.facts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-xl border border-fg/10 bg-fg/[0.02] p-4"
                >
                  <dt className="text-xs font-medium uppercase tracking-widest text-fg/40">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal className="mt-10">
            <Button to="/about" variant="secondary" size="lg">
              Learn More
              <ArrowRightIcon className="size-4" />
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
