"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const NAME = "Jidnesh Chavan";
const LINES = ["Jidnesh", "Chavan"];

export function Preloader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setGone(true);
      onDone();
      return;
    }
    const tick = setInterval(() => {
      setPct((p) => {
        const next = p + Math.random() * 10 + 4;
        if (next >= 100) {
          clearInterval(tick);
          setTimeout(() => {
            setGone(true);
            onDone();
          }, 340);
          return 100;
        }
        return next;
      });
    }, 108);
    return () => clearInterval(tick);
  }, [onDone, reduce]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-200 flex flex-col justify-between bg-[#030504] px-5 pb-6 pt-6"
          exit={{ y: "-101%" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.085)_1px,transparent_1px)] [background-size:22px_22px]" />

          <div className="relative flex justify-between font-mono text-[11.5px] tracking-[0.14em] text-[#6d7a70]">
            <span>PORTFOLIO</span>
            <span>MUMBAI, IN</span>
            <span>2026</span>
          </div>

          <div className="relative flex flex-1 items-center justify-center">
            {/* one line on desktop, stacked on phones so it never overflows */}
            <div
              className="font-big font-extrabold leading-[0.95] tracking-[-0.045em] text-white
                         text-[19vw] sm:text-[min(12.6vw,190px)]"
              aria-label={NAME}
            >
              {LINES.map((line, li) => (
                <div key={line} className="flex sm:inline-flex">
                  {line.split("").map((ch, i) => {
                    const order = li * 8 + i;
                    return (
                      <span
                        key={i}
                        className="inline-block overflow-hidden pb-[0.09em] -mb-[0.09em]"
                      >
                        <motion.span
                          className="inline-block"
                          initial={{ y: "112%" }}
                          animate={{ y: 0 }}
                          transition={{
                            duration: 0.95,
                            ease: [0.16, 1, 0.3, 1],
                            delay: order * 0.038,
                          }}
                        >
                          {ch}
                        </motion.span>
                      </span>
                    );
                  })}
                  {li === 0 && <span className="hidden w-[0.26em] sm:block" />}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-between gap-4">
            <div className="relative h-px max-w-[340px] flex-1 overflow-hidden bg-[#16201a]">
              <div
                className="absolute left-0 top-0 h-full bg-lime"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="min-w-[44px] text-right font-mono text-[11.5px] text-muted">
              {Math.floor(pct)}%
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
