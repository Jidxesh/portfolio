"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { links, sections } from "@/lib/data";

const social = [
  { label: "GitHub", href: links.github },
  { label: "LinkedIn", href: links.linkedin },
  { label: "Instagram", href: links.instagram },
  { label: "Email", href: `mailto:${links.email}` },
];

export function MobileMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-150 bg-ink/80 backdrop-blur-sm sm:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                className="fixed inset-x-0 top-0 z-150 border-b border-line bg-surface px-6 pb-8 pt-5 sm:hidden"
                initial={{ y: "-100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                <DialogPrimitive.Title className="sr-only">
                  Menu
                </DialogPrimitive.Title>

                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-[13px]">Jidnesh Chavan</span>
                  <DialogPrimitive.Close
                    aria-label="Close menu"
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-line text-muted"
                  >
                    ✕
                  </DialogPrimitive.Close>
                </div>

                <nav className="flex flex-col">
                  {sections.map((s, i) => (
                    <motion.a
                      key={s.id}
                      href={`#${s.id}`}
                      onClick={() => setOpen(false)}
                      className="border-b border-line-soft py-3.5 font-big text-[26px] font-extrabold tracking-[-0.035em] active:text-lime"
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.06 + i * 0.045, duration: 0.4 }}
                    >
                      {s.label}
                    </motion.a>
                  ))}
                </nav>

                <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12.5px] text-muted">
                  {social.map((l) => (
                    <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
                      {l.label}
                    </a>
                  ))}
                </div>

                <a
                  href={links.resume}
                  download
                  className="mt-6 block rounded-sm border border-lime bg-lime px-5 py-3 text-center font-mono text-[13px] text-ink"
                >
                  Download résumé ↓
                </a>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
