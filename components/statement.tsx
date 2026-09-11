"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";

const TEXT =
  "I don't have ten years of experience. I have a stack of projects that actually run, a habit of reading the error instead of guessing, and the patience to rewrite the thing once I understand why the first version was wrong.";

function Word({
  word,
  range,
  progress,
  reduce,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const y = useTransform(progress, range, [8, 0]);
  return (
    <span className="relative mr-[0.28em] inline-block">
      <motion.span
        className="inline-block"
        style={reduce ? undefined : { opacity, y }}
      >
        {word}
      </motion.span>
    </span>
  );
}

/**
 * Scroll-linked, word by word. Progress across the section maps to a slice
 * per word, so the paragraph lights up as you read it — and dims if you
 * scroll back.
 */
export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "start 0.2"],
  });

  const words = TEXT.split(" ");

  return (
    <section className="relative z-1 border-t border-line-soft py-20 lg:py-28">
      <div className="mx-auto max-w-[1080px] px-6">
        <p
          ref={ref}
          className="flex max-w-[24ch] flex-wrap font-big text-[clamp(24px,4.4vw,44px)] font-extrabold leading-[1.18] tracking-[-0.035em]"
        >
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word
                key={`${w}-${i}`}
                word={w}
                range={[start, end]}
                progress={scrollYProgress}
                reduce={reduce}
              />
            );
          })}
        </p>
      </div>
    </section>
  );
}
