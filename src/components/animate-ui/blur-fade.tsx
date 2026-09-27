import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

/*
  Blur + fade entrance, adapted from Animate UI (https://animate-ui.com).
  Great for staggered grids (the skills strip uses index-based delays).
*/

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: number;
}

export function BlurFade({ children, className, delay = 0, y = 12, blur = 6 }: BlurFadeProps) {
  const reduceMotion = useReducedMotion();

  // Reduced motion: skip blur/translation entirely.
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
