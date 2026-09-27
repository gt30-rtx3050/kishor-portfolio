import { Hero } from "@/components/home/hero";
import { PerformanceLoop } from "@/components/home/performance-loop";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { AboutPreview } from "@/components/home/about-preview";
import { SkillsStrip } from "@/components/home/skills-strip";
import { ContactCTA } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PerformanceLoop />
      <FeaturedProjects />
      <AboutPreview />
      <SkillsStrip />
      <ContactCTA />
    </>
  );
}
