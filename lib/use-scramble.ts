"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh#@%&*/<>";

/**
 * Runs a wave across the text: characters behind the wave are settled,
 * a short band churns through random glyphs, the rest is untouched.
 * Returns the current string plus a run() you can bind to any trigger.
 */
export function useScramble(
  text: string,
  { total = 26, step = 26 }: { total?: number; step?: number } = {}
) {
  const [display, setDisplay] = useState(text);
  const busy = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => setDisplay(text), [text]);

  const run = useCallback(() => {
    if (busy.current || reduce) return;
    busy.current = true;
    let frame = 0;

    const tick = () => {
      const progress = (frame / total) * text.length;
      setDisplay(
        text
          .split("")
          .map((c, i) => {
            if (c === " ") return " ";
            if (i < progress - 2) return c;
            if (i > progress + 4) return c;
            return POOL[Math.floor(Math.random() * POOL.length)];
          })
          .join("")
      );
      if (frame++ < total) setTimeout(tick, step);
      else {
        setDisplay(text);
        busy.current = false;
      }
    };
    tick();
  }, [text, reduce, total, step]);

  return { display, run, reduce };
}
