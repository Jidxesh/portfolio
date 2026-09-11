"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { stackGroups } from "@/lib/data";

/**
 * Pinned horizontal section. The outer block is tall; the inner panel sticks
 * to the viewport and the card track slides sideways as you scroll down.
 * Distance is measured from the DOM so it stays correct at any width.
 */
export function Stack() {
  const outer = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: outer,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      if (!el) return;
      setDistance(Math.max(0, el.scrollWidth - window.innerWidth + 48));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="stack" ref={outer} className="relative z-1 h-[260vh] border-t border-line-soft lg:h-[320vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-6 w-full max-w-[1080px] px-6 lg:mb-10">
          <h2 className="font-big text-[clamp(25px,3.6vw,34px)] font-extrabold tracking-[-0.035em]">
            What I actually use
          </h2>
          <p className="mt-2 max-w-[58ch] text-[15.5px] text-muted">
            Split by what I know well and what I&apos;m still learning. Keep
            scrolling — this one moves sideways.
          </p>
        </div>

        <motion.div
          ref={track}
          className="flex gap-6 pl-6 pr-6 lg:pl-[max(24px,calc((100vw-1080px)/2))]"
          style={reduce ? undefined : { x }}
        >
          {stackGroups.map((g, i) => (
            <article
              key={g.title}
              className="w-[84vw] shrink-0 rounded-lg border border-line bg-surface p-5 sm:w-[62vw] sm:p-7 lg:w-[420px]"
            >
              <span className="font-mono text-[11.5px] text-muted">
                {String(i + 1).padStart(2, "0")} / {stackGroups.length}
              </span>
              <h3 className="mb-1 mt-3 font-mono text-[13px] font-medium text-lime">
                {g.title}
              </h3>
              <p className="mb-5 text-[13.5px] text-muted">{g.note}</p>
              <ul className="flex flex-wrap gap-[7px]">
                {g.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-sm border border-line bg-ink px-2.5 py-[5px] font-mono text-[12.5px] text-body transition-colors duration-200 hover:border-lime-dim hover:text-lime"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </motion.div>

        <div className="mx-auto mt-6 w-full max-w-[1080px] px-6 lg:mt-10">
          <div className="h-px w-full overflow-hidden bg-line">
            <motion.div
              className="h-full bg-lime"
              style={reduce ? { width: "100%" } : { width: bar }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
