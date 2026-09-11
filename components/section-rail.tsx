"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { sections } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Fixed rail on the right: overall progress plus the current section. */
export function SectionRail() {
  const [active, setActive] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 160, damping: 34 });

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-6 top-1/2 z-60 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col items-end gap-5">
        <div className="absolute right-[3.5px] top-0 h-full w-px bg-line" />
        <motion.div
          className="absolute right-[3.5px] top-0 h-full w-px origin-top bg-lime"
          style={{ scaleY }}
        />

        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="pointer-events-auto group flex items-center gap-3"
          >
            <span
              className={cn(
                "font-mono text-[10px] uppercase tracking-[0.18em] opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                active === s.id && "opacity-100 text-lime"
              )}
            >
              {s.label}
            </span>
            <span
              className={cn(
                "relative z-1 h-2 w-2 rounded-full border border-line bg-ink transition-all duration-300",
                active === s.id && "scale-125 border-lime bg-lime"
              )}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
