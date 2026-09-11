"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { links } from "@/lib/data";

type Channel = {
  label: string;
  value: string;
  href?: string;
  copy?: string;
  note?: string;
};

const channels: Channel[] = [
  { label: "Email", value: links.email, href: `mailto:${links.email}` },
  { label: "GitHub", value: "github.com/Jidxesh", href: links.github },
  { label: "LinkedIn", value: "jidnesh-chavan", href: links.linkedin },
  { label: "Instagram", value: "@jidxesh", href: links.instagram },
  {
    label: "Discord",
    value: links.discord,
    copy: links.discord,
    note: links.discordName,
  },
  { label: "Based in", value: "Mumbai, India" },
];

export function Contact() {
  const [copied, setCopied] = useState<string | null>(null);

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      setCopied(null);
    }
  };

  return (
    <section
      id="contact"
      className="relative z-1 border-t border-line-soft pb-20 pt-16 lg:pb-24 lg:pt-23"
    >
      <div className="mx-auto max-w-[1080px] px-6">
        <Reveal>
          <h2 className="mb-4 max-w-[18ch] font-big text-[clamp(28px,5vw,46px)] font-extrabold tracking-[-0.04em]">
            Looking for an internship, or a team that ships.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mb-8 max-w-[52ch] text-muted">
            If you&apos;re hiring, building something, or just want to argue about
            whether a status column should ever be a single field — my inbox is
            open and I reply.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
            {channels.map((c, i) => {
              const inner = (
                <>
                  <span className="mb-1.5 flex items-center gap-2 font-mono text-[11.5px] text-muted">
                    {c.label}
                    {c.copy && (
                      <span className="text-lime-dim transition-colors group-hover:text-lime">
                        {copied === c.copy ? "copied" : "click to copy"}
                      </span>
                    )}
                  </span>
                  <b className="block break-words text-[14.5px] font-normal transition-colors group-hover:text-lime">
                    {c.value}
                  </b>
                  {c.note && (
                    <span className="mt-1 block font-mono text-[11px] text-muted">
                      {c.note}
                    </span>
                  )}
                </>
              );

              const motionProps = {
                initial: { opacity: 0, rotateX: -35, y: 30 },
                whileInView: { opacity: 1, rotateX: 0, y: 0 },
                viewport: { once: true, amount: 0.5 },
                transition: {
                  duration: 0.7,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1] as const,
                },
                style: { transformPerspective: 800 },
                className:
                  "group block bg-surface p-6 text-left transition-colors hover:bg-surface-2",
              };

              if (c.href) {
                return (
                  <motion.a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    {...motionProps}
                  >
                    {inner}
                  </motion.a>
                );
              }

              if (c.copy) {
                return (
                  <motion.button
                    key={c.label}
                    type="button"
                    onClick={() => onCopy(c.copy!)}
                    {...motionProps}
                  >
                    {inner}
                  </motion.button>
                );
              }

              return (
                <motion.div key={c.label} {...motionProps}>
                  {inner}
                </motion.div>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <a
            href={links.resume}
            download
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-lime bg-lime px-5 py-3 font-mono text-[13.5px] text-ink transition-colors hover:bg-lime-hover"
          >
            Download résumé ↓
          </a>
        </Reveal>
      </div>
    </section>
  );
}
