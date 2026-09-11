"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring, useReducedMotion } from "motion/react";

export function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const spring = useSpring(value, { duration: 1200, bounce: 0 });
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (inView) value.set(to);
  }, [inView, to, value]);

  useEffect(() => {
    return spring.on("change", (v) => setShown(Math.floor(v)));
  }, [spring]);

  return (
    <span ref={ref}>
      {reduce ? to : shown}
      {suffix}
    </span>
  );
}
