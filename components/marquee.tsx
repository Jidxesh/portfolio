"use client";

import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  useReducedMotion,
} from "motion/react";

/** keeps a value looping inside a range without ever resetting visibly */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Velocity-driven marquee. It idles at a slow constant speed, but scroll
 * velocity multiplies it — and scrolling up flips its direction. The band
 * also skews with velocity, which is what sells the sense of drag.
 */
export function Marquee({
  items,
  baseVelocity = 2,
}: {
  items: string[];
  baseVelocity?: number;
}) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const direction = useRef(1);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1400, 0, 1400], [-4, 0, 4], {
    clamp: false,
  });
  const skew = useTransform(smooth, [-1400, 0, 1400], [5, 0, -5], {
    clamp: false,
  });

  // four copies, so wrapping a quarter of the track is seamless
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * Math.abs(f);
    baseX.set(baseX.get() + moveBy);
  });

  const run = [...items, ...items, ...items, ...items];

  return (
    <div className="relative z-1 overflow-hidden border-y border-line-soft bg-surface/40 py-4">
      <motion.div className="flex w-max" style={{ x, skewX: reduce ? 0 : skew }}>
        {run.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap px-[18px] font-mono text-[13px] text-muted"
          >
            {item} <span className="text-lime-dim">✳</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
