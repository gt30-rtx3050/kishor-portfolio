import { Tooltip } from "@mui/material";
import { skills } from "@/lib/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { BlurFade } from "@/components/animate-ui/blur-fade";

/*
  Skills strip: a wrap of chips that blur-fade in with a small stagger.
  MUI Tooltip carries the short note for each skill. Chips are focusable so
  keyboard and screen reader users get the same information as pointer users.
*/
export function SkillsStrip() {
  return (
    <section aria-labelledby="skills-heading" className="border-t border-fg/10">
      <div className="shell py-24 sm:py-28 lg:py-32">
        <SectionHeading
          id="skills-heading"
          eyebrow="Skills"
          title="Tools I reach for"
          align="center"
        />
        <ul className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
          {skills.map((skill, index) => (
            <li key={skill.name}>
              <BlurFade delay={index * 0.04}>
                <Tooltip title={skill.note} placement="top" enterTouchDelay={0}>
                  <span
                    tabIndex={0}
                    className="inline-flex cursor-default items-center rounded-full border border-fg/15 bg-fg/[0.02] px-4 py-2 text-sm font-medium text-fg/80 transition-[border-color,background-color,translate] duration-200 hover:-translate-y-0.5 hover:border-fg/40 hover:bg-fg/5 hover:text-fg"
                  >
                    {skill.name}
                  </span>
                </Tooltip>
              </BlurFade>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
