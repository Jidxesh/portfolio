"use client";

import { useEffect, useRef } from "react";
import { useInView } from "motion/react";
import { useScramble } from "@/lib/use-scramble";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { projects, type Project } from "@/lib/data";

const stateVariant = {
  live: "live",
  building: "building",
  shipped: "shipped",
} as const;

export function Work() {
  return (
    <section id="work" className="relative z-1 border-t border-line-soft py-16 lg:py-23">
      <div className="mx-auto max-w-[1080px] px-6">
        <SectionHeading
          title="Selected work"
          blurb="Five things I've built. Open any of them for what it does, what it's made of, and what it cost me to learn."
        />

        <Reveal>
          <Accordion type="single" collapsible className="border-t border-line">
            {projects.map((p, i) => (
              <ProjectRow key={p.id} project={p} index={i} />
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function ProjectRow({ project: p, index: i }: { project: Project; index: number }) {
  const { display, run } = useScramble(p.name);
  const titleRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(titleRef, { once: true, amount: 0.8 });

  // one pass as the row arrives, staggered down the list
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(run, i * 130);
    return () => clearTimeout(t);
  }, [inView, run, i]);

  return (
    <AccordionItem value={p.id} className="sd-enter">
      {/* hover sweep */}
      <span className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-gradient-to-r from-lime/[0.09] to-transparent transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />

      <AccordionTrigger className="px-2" onMouseEnter={run}>
        <span className="font-mono text-xs text-muted">
          {String(i + 1).padStart(2, "0")}
        </span>

        {/* invisible sizer holds the width so scrambled glyphs can't shift the row */}
        <span className="relative inline-grid flex-1 text-[clamp(19px,2.6vw,25px)] font-medium tracking-[-0.02em] transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-lime">
          <span aria-hidden className="invisible col-start-1 row-start-1">
            {p.name}
          </span>
          <span ref={titleRef} className="col-start-1 row-start-1" aria-label={p.name}>
            <span aria-hidden>{display}</span>
          </span>
        </span>

        <span className="hidden font-mono text-xs text-muted md:block">{p.meta}</span>
        <Badge variant={stateVariant[p.state]}>{p.state}</Badge>
        <span className="font-mono text-base text-muted transition-transform duration-300 group-data-[state=open]:rotate-[135deg] group-data-[state=open]:text-lime">
          +
        </span>
      </AccordionTrigger>

      <AccordionContent className="grid gap-7 px-2 lg:grid-cols-[1.3fr_0.9fr] lg:gap-11">
        <div className="space-y-4">
          {p.body.map((para, j) => (
            <p key={j} className="max-w-[58ch] text-body">
              {para}
            </p>
          ))}
          <p className="border-l-2 border-lime-dim pl-4 text-[14.5px] text-muted">
            What it taught me: {p.learned}
          </p>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap gap-[7px]">
            {p.tags.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
          <div className="flex flex-col gap-2.5 font-mono text-[13px]">
            {p.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-line pb-1.5 text-muted transition-colors hover:text-lime"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
