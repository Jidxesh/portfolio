"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { Button } from "@/components/ui/button";
import { ScrambleText } from "@/components/scramble-text";
import { TextRotator } from "@/components/text-rotator";
import { Terminal } from "@/components/terminal";
import { Pipeline } from "@/components/pipeline";
import { Reveal } from "@/components/reveal";
import { PixelScene } from "@/components/pixel-scene";
import { links, rotatorPhrases } from "@/lib/data";

const LINES = ["App developer,", "full-stack developer,"];

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Scroll-linked exit: the hero drifts up and dims as it leaves,
  // driven by scroll position rather than by a timed animation.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);

  const line = (i: number) => ({
    initial: reduce ? {} : { y: "105%" },
    animate: ready ? { y: 0 } : undefined,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: i * 0.08 },
  });

  return (
    <div
      ref={ref}
      className="relative z-1 mx-auto max-w-[1080px] px-6 pb-14 pt-16 sm:pb-[76px] sm:pt-[92px]"
    >
      <motion.div style={reduce ? undefined : { y, opacity, scale }}>
      <div className="grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr]">
      <div>
      <Reveal>
        <div className="mb-6 flex flex-wrap gap-2.5 font-mono text-[13px] text-muted">
          <span>Mumbai, India</span>
          <span className="text-line">/</span>
          <span>App developer</span>
          <span className="text-line">/</span>
          <span>Full-stack</span>
          <span className="text-line">/</span>
          <span>AI/ML</span>
          <span className="text-line">/</span>
          <span className="text-cyan">Open to internships</span>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h1 className="group relative mb-3.5 inline-block px-1.5 py-1 font-big text-[clamp(29px,4.7vw,50px)] font-extrabold leading-[1.1] tracking-[-0.042em]">
          <ScrambleText text="Jidnesh Chavan" />
          {/* selection frame */}
          <span className="pointer-events-none absolute -inset-y-2 -inset-x-[7px] border border-dashed border-lime/45 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <i className="absolute -left-1 -top-1 h-[7px] w-[7px] border border-lime bg-ink" />
            <i className="absolute -right-1 -top-1 h-[7px] w-[7px] border border-lime bg-ink" />
            <i className="absolute -bottom-1 -left-1 h-[7px] w-[7px] border border-lime bg-ink" />
            <i className="absolute -bottom-1 -right-1 h-[7px] w-[7px] border border-lime bg-ink" />
          </span>
        </h1>
      </Reveal>

      <div className="mb-6 font-big text-[clamp(29px,5.4vw,54px)] font-extrabold leading-[1.06] tracking-[-0.045em]">
        {LINES.map((text, i) => (
          <span key={text} className="block overflow-hidden">
            <motion.span className="block" {...line(i)}>
              {text}
            </motion.span>
          </span>
        ))}
        <span className="block overflow-hidden">
          <motion.span className="block" {...line(2)}>
            learning{" "}
            <TextRotator phrases={rotatorPhrases} className="gradient-text" />
          </motion.span>
        </span>
      </div>

      <Reveal delay={0.1}>
        <p className="mb-8 max-w-[56ch] text-[clamp(16px,2.1vw,19px)] text-muted">
          I build Android apps in{" "}
          <strong className="font-medium text-white">Kotlin and Jetpack Compose</strong>, and
          I&apos;m working my way through{" "}
          <strong className="font-medium text-white">full-stack</strong> and{" "}
          <strong className="font-medium text-white">AI/ML</strong> — one project at a time,
          learning by shipping rather than by reading ahead.
        </p>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="flex flex-wrap gap-2.5 sm:gap-3">
          <Button variant="solid" asChild>
            <a href="#work">See the work</a>
          </Button>
          <Button asChild>
            <a href={links.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </Button>
          <Button asChild>
            <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </Button>
          <Button asChild>
            <a href={links.resume} download>
              Download résumé ↓
            </a>
          </Button>
        </div>
      </Reveal>

      </div>

      <PixelScene />
      </div>
      </motion.div>

      <Reveal delay={0.2}>
        <Terminal />
      </Reveal>

      <Reveal delay={0.25}>
        <Pipeline />
      </Reveal>
    </div>
  );
}
