"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { pipeline } from "@/lib/data";

/**
 * Scroll-linked: the pipeline doesn't play on entry, it tracks scroll
 * position. Scroll back up and it drains. Each stage owns a slice of the
 * section's 0..1 progress.
 */
function Stage({
  stage,
  index,
  total,
  progress,
  isLast,
  reduce,
}: {
  stage: (typeof pipeline)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  isLast: boolean;
  reduce: boolean | null;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const on = stage.live ? "#22d3ee" : "#a3e635";

  const railWidth = useTransform(progress, [start, end], ["0%", "100%"]);
  const nodeFill = useTransform(progress, [start, start + 0.04], ["#050706", on]);
  const nodeStroke = useTransform(progress, [start, start + 0.04], ["#1e2a20", on]);
  const titleColor = useTransform(
    progress,
    [start, start + 0.06],
    ["#808e83", "#ffffff"]
  );

  return (
    <div className="relative pr-3.5">
      {!isLast && (
        <div className="absolute left-[5px] top-[5px] hidden h-[1.5px] w-full bg-line md:block">
          <motion.div
            className="h-full bg-lime-dim"
            style={reduce ? { width: "100%" } : { width: railWidth }}
          />
        </div>
      )}

      <motion.div
        className="relative z-2 h-[11px] w-[11px] rounded-full border-[1.5px]"
        style={
          reduce
            ? { backgroundColor: on, borderColor: on }
            : { backgroundColor: nodeFill, borderColor: nodeStroke }
        }
      />

      <motion.h3
        className="mb-1 mt-4 text-[14.5px] font-medium"
        style={reduce ? { color: "#ffffff" } : { color: titleColor }}
      >
        {stage.title}
      </motion.h3>
      <p className="font-mono text-[11.5px] text-muted">{stage.note}</p>
    </div>
  );
}

export function Pipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "center 45%"],
  });

  return (
    <div
      ref={ref}
      className="mt-7 rounded-md border border-line bg-surface p-[22px]"
    >
      <div className="mb-[22px] flex flex-wrap justify-between gap-x-3 gap-y-1 border-b border-line-soft pb-3 font-mono text-[11px] text-muted sm:text-[11.5px]">
        <span>status_event — the pattern behind most of what I build</span>
        <span>append-only</span>
      </div>

      <div className="grid gap-5 md:grid-cols-4 md:gap-0">
        {pipeline.map((stage, i) => (
          <Stage
            key={stage.title}
            stage={stage}
            index={i}
            total={pipeline.length}
            progress={scrollYProgress}
            isLast={i === pipeline.length - 1}
            reduce={reduce}
          />
        ))}
      </div>
    </div>
  );
}
