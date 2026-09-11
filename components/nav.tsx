"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { sections } from "@/lib/data";
import { MobileMenu } from "@/components/mobile-menu";
import { cn } from "@/lib/utils";

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  useEffect(() => {
    const onScroll = () => {
      const mid = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= mid) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-70 border-b border-line-soft bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-6 py-3.5">
        <a href="#top" className="flex items-center gap-2.5 font-mono text-[13px]">
          <span className="h-[7px] w-[7px] rounded-full bg-cyan" />
          Jidnesh Chavan
        </a>

        <nav className="flex items-center gap-[22px] font-mono text-[13px]">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                "hidden border-b border-transparent pb-0.5 text-muted transition-colors hover:text-white sm:block",
                active === s.id && "border-lime text-white"
              )}
            >
              {s.label}
            </a>
          ))}
          <button
            onClick={onOpenPalette}
            aria-label="Open quick jump"
            className="hidden cursor-pointer rounded-sm border border-line bg-surface px-[7px] py-[3px] font-mono text-[11px] text-muted transition-colors hover:border-lime-dim hover:text-lime sm:block"
          >
            ⌘K
          </button>

          {/* mobile: a real menu beats a keyboard shortcut */}
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] rounded-sm border border-line bg-surface sm:hidden"
          >
            <span className="h-px w-3.5 bg-body" />
            <span className="h-px w-3.5 bg-body" />
          </button>
        </nav>
      </div>

      <motion.div
        className="absolute bottom-[-1px] left-0 h-px w-full origin-left bg-lime"
        style={{ scaleX: progress }}
      />

      <MobileMenu open={menuOpen} setOpen={setMenuOpen} />
    </header>
  );
}
