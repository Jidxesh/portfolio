"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { WaveTerrain } from "@/components/wave-terrain";

/**
 * Parallax: two fixed layers moving at different rates against the page.
 * The grid drifts up slowly, the glow drifts down, so the background
 * separates into depth instead of scrolling as one flat sheet.
 */
export function ParallaxBackdrop() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();

  const gridY = useTransform(scrollY, [0, 4000], [0, -380]);
  const glowY = useTransform(scrollY, [0, 4000], [0, 260]);
  const glowOpacity = useTransform(scrollY, [0, 700, 2200], [0.5, 0.28, 0.1]);

  if (reduce) return <div className="field" />;

  return (
    <>
      <WaveTerrain />
      <motion.div className="field opacity-25" style={{ y: gridY }} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-[-12%] z-0 h-[70vh]
                   bg-[radial-gradient(50%_50%_at_22%_18%,rgba(132,204,22,0.18),transparent_70%)]"
        style={{ y: glowY, opacity: glowOpacity }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-[30%] z-0 h-[60vh]
                   bg-[radial-gradient(45%_45%_at_78%_40%,rgba(34,211,238,0.10),transparent_70%)]"
        style={{ y: glowY, opacity: glowOpacity }}
      />
    </>
  );
}
