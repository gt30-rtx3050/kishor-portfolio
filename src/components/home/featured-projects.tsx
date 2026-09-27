import { Link } from "react-router-dom";
import { Card, CardBody, Chip } from "@heroui/react";
import { featuredProjects, type Project } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ArrowUpRightIcon } from "@/components/ui/icons";

/*
  Project card: HeroUI Card + Chip inside a router Link so the whole card
  is one keyboard-focusable target. Hover: lift, brighter border, soft glow,
  image scale (the glow is white-alpha, still on palette).
*/
function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.1} className="h-full">
      <Link
        to={project.href}
        aria-label={`${project.title}: view project details`}
        className="group block h-full rounded-2xl"
      >
        <Card
          shadow="none"
          className="h-full rounded-2xl border border-fg/10 bg-fg/[0.02] transition-[border-color,translate,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-fg/30 group-hover:shadow-[0_16px_48px_rgba(255,255,255,0.07)]"
        >
          <CardBody className="p-0">
            <div className="overflow-hidden rounded-t-2xl border-b border-fg/10">
              <img
                src={project.image}
                alt={project.imageAlt}
                loading="lazy"
                decoding="async"
                className="aspect-[16/10] w-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex grow flex-col gap-3 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-normal tracking-tight">
                  {project.title}
                </h3>
                <ArrowUpRightIcon className="size-5 shrink-0 text-fg/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
              </div>
              <p className="text-sm font-light leading-relaxed text-fg/60">{project.description}</p>
              <ul className="mt-1 flex flex-wrap gap-2" aria-label="Technologies used">
                {project.tags.map((tag) => (
                  <Chip
                    key={tag}
                    size="sm"
                    variant="bordered"
                    radius="sm"
                    classNames={{
                      base: "border-fg/15 bg-transparent",
                      content: "px-1.5 text-xs font-medium text-fg/60",
                    }}
                  >
                    {tag}
                  </Chip>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </Link>
    </Reveal>
  );
}

export function FeaturedProjects() {
  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-20 border-t border-fg/10">
      <div className="shell py-24 sm:py-28 lg:py-32">
        <SectionHeading
          id="work-heading"
          eyebrow="Featured Work"
          title="Selected projects"
          linkTo="/projects"
          linkLabel="View all projects"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
