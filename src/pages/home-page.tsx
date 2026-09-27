import { Hero } from "@/components/home/hero";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { AboutPreview } from "@/components/home/about-preview";
import { SkillsStrip } from "@/components/home/skills-strip";
import { ContactCTA } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <AboutPreview />
      <SkillsStrip />
      <ContactCTA />
    </>
  );
}
