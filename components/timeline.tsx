"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { timeline } from "@/lib/data";
import { cn } from "@/lib/utils";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 60%"],
  });
  const height = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="path" className="relative z-1 border-t border-line-soft py-16 lg:py-23">
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionHeading
          title="The path so far"
          blurb="Diploma first, then the degree, with the interesting parts happening in between."
        />

        <div ref={ref} className="relative pl-6.5">
          <div className="absolute left-1 top-1.5 h-full w-px bg-line" />
          <motion.div
            className="absolute left-1 top-1.5 w-px origin-top bg-lime-dim"
            style={{ height: "100%", scaleY: height }}
          />

          {timeline.map((row, i) => (
            <Reveal key={row.title} delay={i * 0.04}>
              <div className="relative pb-8.5 last:pb-0">
                <span
                  className={cn(
                    "absolute -left-[26px] top-2 h-[9px] w-[9px] rounded-full border-[1.5px] border-lime bg-ink",
                    row.now && "border-cyan bg-cyan"
                  )}
                />
                <div className="font-mono text-xs text-muted">{row.when}</div>
                <h3 className="mb-1.5 mt-1 text-[17px] font-medium">{row.title}</h3>
                <p className="max-w-[58ch] text-[14.5px] text-muted">{row.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
