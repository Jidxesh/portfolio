"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function TextRotator({
  phrases,
  interval = 2800,
  className,
}: {
  phrases: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (phrases.length <= 1) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIndex((i) => (i + 1) % phrases.length);
    }, interval);
    return () => clearInterval(id);
  }, [phrases.length, interval]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span className="relative inline-grid overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
      {/* sizer: holds the width of the longest phrase so nothing reflows */}
      <span aria-hidden className="col-start-1 row-start-1 invisible whitespace-nowrap">
        {longest}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={phrases[index]}
          className={cn("col-start-1 row-start-1 whitespace-nowrap", className)}
          initial={reduce ? false : { y: "112%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-112%", opacity: 0 }}
          transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>

      <span aria-live="polite" className="sr-only">
        {phrases[index]}
      </span>
    </span>
  );
}
