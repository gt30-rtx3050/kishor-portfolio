import { useReducedMotion, motion } from "framer-motion";
import { cn } from "@/lib/utils";

/*
  Word-by-word text reveal, adapted from Animate UI (https://animate-ui.com).
  Each word rises out of an overflow mask when scrolled into view.
  The wrapper carries an aria-label so screen readers read one clean string.
*/

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function TextReveal({ text, className, delay = 0, stagger = 0.04 }: TextRevealProps) {
  const reduceMotion = useReducedMotion();

  // Reduced motion: render plain text, no animation.
  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <span className={cn("inline", className)}>
      {/* Screen readers get one clean string; the animated words are hidden. */}
      <span className="sr-only">{text}</span>
      <motion.span
        className="inline"
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
      >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            aria-hidden="true"
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: "115%" },
              visible: { y: "0%", transition: { duration: 0.65, ease: EASE } },
            }}
          >
            {word}
            {index < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
          ))}
        </motion.span>
    </span>
  );
}
