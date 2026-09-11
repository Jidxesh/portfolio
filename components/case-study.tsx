"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { cn } from "@/lib/utils";

const STATUSES = ["Applied", "Screening", "Interview", "Offer"];

const STEPS = [
  {
    kicker: "The idea",
    title: "A status isn't a field. It's an event.",
    body: "Most trackers store one status column and overwrite it. You lose the date you applied, how long screening took, when it went quiet. Every change here is written as a new row instead, so the history survives.",
  },
  {
    kicker: "The schema",
    title: "One application, many status events.",
    body: "An application row holds what doesn't change — company, role, link. A status_event row holds what does — the new status, when it happened, an optional note. Reading the current status means taking the latest event.",
  },
  {
    kicker: "The API",
    title: "Spring Boot, and nothing clever.",
    body: "REST endpoints behind JWT auth. Posting a status change appends an event rather than patching the application. The timeline endpoint returns the events in order, which is the whole feature.",
  },
  {
    kicker: "Shipping",
    title: "Docker on Render, Postgres on Neon.",
    body: "The API runs in a container in Singapore, the database is managed. Getting it running there taught me more about config and connection pooling than getting it running locally ever did.",
  },
];

export function CaseStudy() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  // Sticky section: progress runs 0..1 across the whole tall column,
  // and drives which frame the pinned visual shows.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(STEPS.length - 1, Math.floor(v * STEPS.length));
    setActive(next < 0 ? 0 : next);
  });

  // the pinned card drifts a little against its own column — parallax
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const barWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="case"
      ref={ref}
      className="relative z-1 border-t border-line-soft py-16 lg:py-23"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <div className="mb-11">
          <span className="font-mono text-[12px] text-lime">Case study</span>
          <h2 className="mt-2 font-big text-[clamp(25px,3.6vw,34px)] font-extrabold tracking-[-0.035em]">
            Job Application Tracker
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ---------- pinned visual ---------- */}
          <div className="sticky top-20 z-2 -mx-6 bg-ink/92 px-6 py-4 backdrop-blur-sm lg:top-28 lg:mx-0 lg:h-[62vh] lg:self-start lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none">
            <motion.div
              style={reduce ? undefined : { y: cardY }}
              className="rounded-lg border border-line bg-surface p-5"
            >
              <div className="mb-5 flex items-center justify-between border-b border-line-soft pb-3">
                <span className="font-mono text-[11.5px] text-muted">
                  application #1042
                </span>
                <span className="font-mono text-[11.5px] text-cyan">
                  {STATUSES[active]}
                </span>
              </div>

              <ul className="space-y-0">
                {STATUSES.map((s, i) => {
                  const done = i < active;
                  const now = i === active;
                  return (
                    <li key={s} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < STATUSES.length - 1 && (
                        <span
                          className={cn(
                            "absolute left-[5px] top-4 h-full w-px transition-colors duration-500",
                            done ? "bg-lime-dim" : "bg-line"
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "relative z-1 mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border-[1.5px] transition-all duration-500",
                          done && "border-lime bg-lime",
                          now &&
                            "border-cyan bg-cyan shadow-[0_0_0_5px_rgba(34,211,238,0.15)]",
                          !done && !now && "border-line bg-ink"
                        )}
                      />
                      <div>
                        <div
                          className={cn(
                            "text-[15px] transition-colors duration-500",
                            done || now ? "text-white" : "text-muted/50"
                          )}
                        >
                          {s}
                        </div>
                        <div className="font-mono text-[11px] text-muted">
                          {done || now
                            ? `status_event · row ${i + 1}`
                            : "not yet written"}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-5 h-px w-full overflow-hidden bg-line">
                <motion.div
                  className="h-full bg-lime"
                  style={reduce ? { width: "100%" } : { width: barWidth }}
                />
              </div>
            </motion.div>

            <p className="mt-3 font-mono text-[11px] text-muted">
              nothing is overwritten — rows are only appended
            </p>
          </div>

          {/* ---------- scrolling copy ---------- */}
          <div>
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="flex min-h-[58vh] flex-col justify-center lg:min-h-[72vh]"
              >
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.55 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  animate={{ opacity: active === i ? 1 : 0.45 }}
                >
                  <span className="font-mono text-[12px] text-lime">
                    {String(i + 1).padStart(2, "0")} · {step.kicker}
                  </span>
                  <h3 className="mb-3 mt-2 font-big text-[clamp(21px,2.8vw,28px)] font-extrabold leading-[1.15] tracking-[-0.03em]">
                    {step.title}
                  </h3>
                  <p className="max-w-[46ch] text-body">{step.body}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
