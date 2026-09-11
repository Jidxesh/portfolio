"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { terminalLines } from "@/lib/data";

const tone = { q: "text-cyan", o: "text-body", k: "text-lime" } as const;

export function Terminal() {
  const [typed, setTyped] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setTyped(terminalLines.map((l) => l.text));
      setDone(true);
      return;
    }

    let line = 0;
    let char = 0;
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      if (line >= terminalLines.length) {
        setDone(true);
        return;
      }
      const full = terminalLines[line].text;
      char += 1;

      // Snapshot both counters. The state updater runs later, by which
      // point `line` and `char` may already have advanced — that race
      // was writing each line's final character into the wrong slot.
      const atLine = line;
      const upTo = char;
      setTyped((prev) => {
        const next = [...prev];
        next[atLine] = full.slice(0, upTo);
        return next;
      });

      if (char >= full.length) {
        line += 1;
        char = 0;
        setTimeout(step, 260);
      } else {
        setTimeout(step, 16);
      }
    };

    const start = setTimeout(step, 500);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [reduce]);

  return (
    <div className="mt-14 overflow-hidden rounded-md border border-line bg-gradient-to-b from-surface to-surface/35">
      <div className="flex items-center gap-2 border-b border-line-soft px-3.5 py-2.5 font-mono text-[11.5px] text-muted">
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="h-2 w-2 rounded-full bg-line" />
        <span className="ml-2">jidnesh@mumbai — zsh</span>
      </div>
      <div className="min-h-[150px] overflow-x-auto px-4 pb-5 pt-4 font-mono text-[11.5px] leading-[1.9] sm:text-[13px] sm:leading-[1.95]">
        {terminalLines.map((l, i) => (
          <div key={i} className={`${tone[l.kind]} whitespace-pre-wrap break-words`}>
            {l.kind === "q" ? "$ " : "  "}
            {typed[i] ?? ""}
          </div>
        ))}
        {done && (
          <div className="text-cyan">
            ${" "}
            <span className="inline-block h-3.5 w-[7px] animate-[blink_1s_steps(2)_infinite] bg-lime align-[-2px]" />
          </div>
        )}
      </div>
    </div>
  );
}
