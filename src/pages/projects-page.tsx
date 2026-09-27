import { useEffect } from "react";
import { TextReveal } from "@/components/animate-ui/text-reveal";
import { OrbitExperience } from "@/components/experience/orbit-experience";
import { ChevronDownIcon } from "@/components/ui/icons";
import { site } from "@/lib/site";
import "@fontsource/inter/500.css";
import "@/styles/experience.css";

export default function ProjectsPage() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Experience — ${site.name}`;
    return () => { document.title = previousTitle; };
  }, []);

  return (
    <div className="experience-route">
      <section className="experience-page-hero" aria-labelledby="experience-page-heading">
        <div className="shell experience-page-hero-inner">
          <p className="experience-page-eyebrow">Content · Strategy · Growth / 2018–2026</p>
          <h1 id="experience-page-heading">
            <span><TextReveal text="Experience," /></span>
            <span><TextReveal text="in perspective." delay={0.15} /></span>
          </h1>
          <p className="experience-page-summary">
            From content writing to growth marketing. The teams, roles, and chapters along the way.
          </p>
        </div>
        <a className="experience-page-scroll" href="#career-orbit">
          Scroll to explore
          <ChevronDownIcon className="size-5" />
        </a>
      </section>
      <OrbitExperience />
    </div>
  );
}
