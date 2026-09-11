"use client";

import { useEffect } from "react";
import { useScramble } from "@/lib/use-scramble";

/** Self-running version: kicks off on mount, loops, and re-runs on hover. */
export function ScrambleText({
  text,
  className,
  autoEvery = 5200,
  startDelay = 1200,
}: {
  text: string;
  className?: string;
  autoEvery?: number;
  startDelay?: number;
}) {
  const { display, run, reduce } = useScramble(text);

  useEffect(() => {
    if (reduce) return;
    const kickoff = setTimeout(run, startDelay);
    const loop = setInterval(() => {
      if (!document.hidden) run();
    }, autoEvery);
    return () => {
      clearTimeout(kickoff);
      clearInterval(loop);
    };
  }, [run, reduce, autoEvery, startDelay]);

  return (
    <span className={className} onMouseEnter={run} aria-label={text}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
