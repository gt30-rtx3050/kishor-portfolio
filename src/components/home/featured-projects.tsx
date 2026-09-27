import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
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

export function FeaturedProjects() {
  const [active, setActive] = useState(2);
  const viewportRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dragRef = useRef({ pointerId: -1, startX: 0, startY: 0, scrollLeft: 0, moved: false });
  const prefersReducedMotion = useReducedMotion();

  const goTo = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return;
    viewport.scrollTo({
      left: slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  }, [prefersReducedMotion]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    let frame = 0;
    let nearestIndex = 2;

    // Native scrolling owns the position. Depth follows it continuously, rather
    // than shuffling absolutely-positioned cards or springing them across a loop.
    const update = () => {
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let closest = Infinity;
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const distance = slide.offsetLeft + slide.clientWidth / 2 - center;
        const progress = Math.max(-2, Math.min(2, distance / slide.clientWidth));
        const card = slide.firstElementChild as HTMLElement;
        card.style.transform = prefersReducedMotion
          ? "none"
          : `perspective(1400px) rotateY(${-progress * 18}deg) scale(${1 - Math.min(Math.abs(progress), 2) * 0.08})`;
        if (Math.abs(distance) < closest) {
          closest = Math.abs(distance);
          nearestIndex = index;
        }
      });
      setActive(nearestIndex);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    const onResize = () => {
      const slide = slideRefs.current[nearestIndex];
      if (slide) viewport.scrollLeft = slide.offsetLeft - (viewport.clientWidth - slide.clientWidth) / 2;
      update();
    };
    // Vertical wheel scrolling still moves the page; trackpad horizontal gestures
    // work natively. Shift + wheel also works with a conventional mouse.
    const onWheel = (event: WheelEvent) => {
      if (!event.shiftKey || event.deltaX !== 0) return;
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewport.clientWidth : 1);
      const atEdge = delta < 0 ? viewport.scrollLeft <= 1 : viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 1;
      if (atEdge) return;
      event.preventDefault();
      viewport.scrollLeft += delta;
    };
    onResize();
    const observer = new ResizeObserver(onResize);
    observer.observe(viewport);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("scroll", onScroll);
      viewport.removeEventListener("wheel", onWheel);
    };
  }, [prefersReducedMotion]);

  const finishDrag = () => {
    const viewport = viewportRef.current;
    const drag = dragRef.current;
    if (!viewport || drag.pointerId === -1) return;
    const pointerId = drag.pointerId;
    drag.pointerId = -1;
    viewport.classList.remove("is-dragging");
    if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId);
    if (drag.moved) {
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      let closest = 0;
      let distance = Infinity;
      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const nextDistance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
        if (nextDistance < distance) {
          closest = index;
          distance = nextDistance;
        }
      });
      goTo(closest);
    }
  };

  return (
    <section id="work" aria-labelledby="work-heading" className="experience-section scroll-mt-20">
      <div className="experience-heading">
        <p className="experience-eyebrow">A career in content &amp; growth</p>
        <h2 id="work-heading">My Experience</h2>
        <p className="experience-intro">A few of the teams and brands I’ve helped move forward.</p>
      </div>

      <div className="experience-controls" role="group" aria-label="Experience carousel controls">
        <button type="button" onClick={() => goTo(active - 1)} disabled={active === 0} aria-label="Previous experience" aria-controls="experience-carousel" className="experience-arrow">
          <ArrowRightIcon className="size-4 rotate-180" />
        </button>
        <div className="experience-pagination" role="group" aria-label="Choose an experience">
          {experiences.map((experience, index) => (
            <button
              key={experience.company}
              type="button"
              className="experience-page"
              aria-label={`Go to experience ${index + 1}: ${experience.company}`}
              aria-current={active === index ? "true" : undefined}
              aria-controls="experience-carousel"
              onClick={() => goTo(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => goTo(active + 1)} disabled={active === experiences.length - 1} aria-label="Next experience" aria-controls="experience-carousel" className="experience-arrow">
          <ArrowRightIcon className="size-4" />
        </button>
      </div>

      <div
        id="experience-carousel"
        ref={viewportRef}
        className="experience-stage"
        role="region"
        aria-roledescription="carousel"
        aria-label="Career experience"
        aria-describedby="experience-instructions"
        tabIndex={0}
        onKeyDown={(event) => {
          if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
          event.preventDefault();
          const next = event.key === "Home" ? 0 : event.key === "End" ? experiences.length - 1 : active + (event.key === "ArrowRight" ? 1 : -1);
          goTo(Math.max(0, Math.min(experiences.length - 1, next)));
        }}
        onPointerDown={(event) => {
          // Touch uses the browser's own momentum and scroll snapping.
          if (event.pointerType === "touch" || event.button !== 0) {
            dragRef.current.moved = false;
            return;
          }
          dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, scrollLeft: event.currentTarget.scrollLeft, moved: false };
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current;
          if (event.pointerId !== drag.pointerId) return;
          const delta = event.clientX - drag.startX;
          if (!drag.moved && (Math.abs(delta) < 6 || Math.abs(delta) < Math.abs(event.clientY - drag.startY))) return;
          drag.moved = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.classList.add("is-dragging");
          event.currentTarget.scrollLeft = drag.scrollLeft - delta;
        }}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        onLostPointerCapture={finishDrag}
        onPointerLeave={() => { if (!dragRef.current.moved) dragRef.current.pointerId = -1; }}
        onClickCapture={(event) => {
          if (dragRef.current.moved) {
            event.preventDefault();
            event.stopPropagation();
            dragRef.current.moved = false;
          }
        }}
        onDragStart={(event) => event.preventDefault()}
      >
        {experiences.map((experience, index) => (
          <div className="experience-slide" key={experience.company} ref={(node) => { slideRefs.current[index] = node; }}>
            <article
              className={`experience-card${active === index ? " experience-card--active" : ""}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${experiences.length}: ${experience.company}`}
              onClick={() => goTo(index)}
            >
              <div className="experience-image-wrap">
                <img src={experience.image} alt={experience.imageAlt} loading="lazy" draggable={false} />
                <span className="experience-image-index">{String(index + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span>
                <span className="experience-years">{experience.years}</span>
              </div>
              <div className="experience-card-body">
                <p className="experience-role">{experience.role}</p>
                <h3>{experience.company}</h3>
                <a className="experience-cta" href="#contact" onClick={(event) => event.stopPropagation()} onFocus={() => goTo(index)}>
                  Let’s talk <ArrowUpRightIcon className="size-4" />
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>
      <div className="experience-footer">
        <p id="experience-instructions" className="experience-hint">Drag or swipe to explore <span aria-hidden="true">↔</span><span className="sr-only">. Use left and right arrow keys, or Shift and mouse wheel, to scroll through experiences.</span></p>
        <p className="experience-count" role="status" aria-live="polite" aria-atomic="true">
          <span>{String(active + 1).padStart(2, "0")}</span> / {String(experiences.length).padStart(2, "0")}
          <span className="sr-only">: {experiences[active].company}</span>
        </p>
      </div>
    </section>
  );
}
