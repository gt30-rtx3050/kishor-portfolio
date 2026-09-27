import { contactCta, site } from "@/lib/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { TextReveal } from "@/components/animate-ui/text-reveal";
import { ArrowRightIcon, MailIcon } from "@/components/ui/icons";

export function ContactCTA() {
  return (
    <section aria-labelledby="contact-heading" className="relative overflow-hidden border-t border-fg/10">
      {/* Soft white glow rising from the bottom edge, palette-safe. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(255,255,255,0.07),transparent_70%)]"
      />
      <div className="shell relative flex flex-col items-center py-24 text-center sm:py-28 lg:py-36">
        <Reveal>
          <Badge>{contactCta.eyebrow}</Badge>
        </Reveal>
        <h2
          id="contact-heading"
          className="mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl"
        >
          <TextReveal text={contactCta.heading} delay={0.1} />
        </h2>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-fg/60 sm:text-lg">
            {contactCta.copy}
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button to="/contact" size="lg">
            {contactCta.buttonLabel}
            <ArrowRightIcon className="size-4" />
          </Button>
          <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
            <MailIcon className="size-4" />
            {site.email}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
