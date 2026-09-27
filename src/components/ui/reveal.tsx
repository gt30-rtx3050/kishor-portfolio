import type { ReactNode } from "react";
import { motion } from "framer-motion";

/*
  Scroll reveal used consistently for every section on the page
  (Framer Motion whileInView, fired once, slight rise + fade).
  MotionConfig reducedMotion="user" in App.tsx simplifies this
  automatically for users who prefer reduced motion.
*/

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export function Reveal({ children, className, delay = 0, y = 28 }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
