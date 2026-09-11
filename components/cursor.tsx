"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.4 });
  const [hot, setHot] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine);
    if (!fine) return;

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(!!el?.closest("a, button, li, [data-cursor='hot']"));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-190 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime"
        style={{ x, y }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-190 -translate-x-1/2 -translate-y-1/2 rounded-full border border-lime/45"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: hot ? 52 : 30,
          height: hot ? 52 : 30,
          backgroundColor: hot ? "rgba(163,230,53,0.10)" : "rgba(163,230,53,0)",
        }}
        transition={{ duration: 0.22 }}
      />
    </>
  );
}
