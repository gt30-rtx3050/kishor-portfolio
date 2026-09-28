import { Hero } from "@/components/home/hero";
import { TextCylinder } from "@/components/home/text-cylinder";
import { FeaturedProjects } from "@/components/home/featured-projects";
import { AboutPreview } from "@/components/home/about-preview";
import { SkillsStrip } from "@/components/home/skills-strip";
import { ContactCTA } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TextCylinder />
      <FeaturedProjects />
      <AboutPreview />
      <SkillsStrip />
      <ContactCTA />
    </>
  );
}
