import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { featuredProjects } from "@/lib/site";
import { ArrowRightIcon, ArrowUpRightIcon } from "@/components/ui/icons";

const experiences = [
  {
    company: "SB Web Technology",
    role: "Content Writer",
    years: "2018–2020",
    image: featuredProjects[0].image,
    imageAlt: "Analytics dashboard representing content and performance work",
  },
  {
    company: "KPO & Company",
    role: "Content Manager",
    years: "2020–2022",
    image: featuredProjects[1].image,
    imageAlt: "Digital commerce experience representing content management",
  },
  {
    company: "Daraz [Alibaba Group]",
    role: "Content Lead/Digital Marketing",
    years: "2023–2024",
    image: featuredProjects[2].image,
    imageAlt: "Connected conversations representing digital marketing",
  },
  {
    company: "Himalayan Dream Treks [Remote]",
    role: "SEO Content Manager",
    years: "2023–2024",
    image: featuredProjects[0].image,
    imageAlt: "Analytics dashboard representing SEO content strategy",
  },
  {
    company: "AFC Urgent Care [Remote]",
    role: "Growth Marketing Manager",
    years: "2024–2026",
    image: featuredProjects[1].image,
    imageAlt: "Digital commerce experience representing growth marketing",
  },
];

const wrapOffset = (index: number, active: number) =>
  ((index - active + experiences.length + 2) % experiences.length) - 2;

export function FeaturedProjects() {
  const [active, setActive] = useState(2);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const updateWidth = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const cardStep = viewportWidth < 640 ? viewportWidth * 0.56 : Math.min(viewportWidth * 0.21, 300);

  const move = (direction: number) => {
    setActive((current) => (current + direction + experiences.length) % experiences.length);
  };

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="experience-section scroll-mt-20 overflow-hidden bg-white text-black"
    >
      <div className="experience-heading">
        <div>
          <p className="experience-eyebrow">A career in content &amp; growth</p>
          <h2 id="work-heading">My Experience</h2>
          <p className="experience-intro">
            A few of the teams and brands I’ve helped move forward.
          </p>
        </div>
        <div className="experience-controls" aria-label="Experience carousel controls">
          <span className="experience-count" aria-live="polite">
            <span>{String(active + 1).padStart(2, "0")}</span> / {String(experiences.length).padStart(2, "0")}
          </span>
          <button type="button" onClick={() => move(-1)} aria-label="Previous experience" className="experience-arrow">
            <ArrowRightIcon className="size-5 rotate-180" />
          </button>
          <button type="button" onClick={() => move(1)} aria-label="Next experience" className="experience-arrow">
            <ArrowRightIcon className="size-5" />
          </button>
        </div>
      </div>

      <div
        className="experience-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Career experience"
      >
        {experiences.map((experience, index) => {
          const offset = wrapOffset(index, active);
          const isActive = offset === 0;
          return (
            <motion.article
              key={experience.company}
              className={`experience-card ${Math.abs(offset) === 2 ? "experience-card--far" : ""} ${isActive ? "experience-card--active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${experiences.length}: ${experience.company}`}
              aria-current={isActive ? "true" : undefined}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(index);
                }
              }}
              initial={false}
              animate={{
                x: offset * cardStep,
                y: Math.abs(offset) === 0 ? 0 : Math.abs(offset) === 1 ? 24 : 54,
                scale: isActive ? 1 : Math.abs(offset) === 1 ? 0.91 : 0.82,
                rotate: offset * -2.5,
                opacity: Math.abs(offset) === 2 ? 0.76 : 1,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 190, damping: 24, mass: 0.8 }
              }
              style={{ zIndex: 10 - Math.abs(offset) }}
              onClick={() => setActive(index)}
            >
              <div className="experience-image-wrap">
                <img src={experience.image} alt={experience.imageAlt} loading="lazy" />
                <span className="experience-image-index">0{index + 1}</span>
              </div>
              <div className="experience-card-body">
                <h3>{experience.company}</h3>
                <p className="experience-role">{experience.role}</p>
                <p className="experience-years">{experience.years}</p>
                <a className="experience-cta" href="#contact" onClick={(event) => event.stopPropagation()}>
                  Let’s talk <ArrowUpRightIcon className="size-4" />
                </a>
              </div>
            </motion.article>
          );
        })}
      </div>
      <p className="experience-hint" aria-hidden="true">Select a card or use the arrows to explore</p>
    </section>
  );
}
