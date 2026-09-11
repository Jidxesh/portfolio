"use client";

import { useEffect } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { links, sections } from "@/lib/data";

export function CommandPalette({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const go = (href: string) => {
    setOpen(false);
    if (href.startsWith("#")) {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.open(href, "_blank", "noopener");
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a section, or open a link…" />
      <CommandList>
        <CommandEmpty>Nothing matches that.</CommandEmpty>

        <CommandGroup heading="Sections">
          {sections.map((s) => (
            <CommandItem key={s.id} value={s.label} onSelect={() => go(`#${s.id}`)}>
              {s.label}
              <em className="not-italic text-lime-dim">section</em>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Links">
          <CommandItem value="GitHub Jidxesh" onSelect={() => go(links.github)}>
            GitHub — Jidxesh
            <em className="not-italic text-lime-dim">external</em>
          </CommandItem>
          <CommandItem value="LinkedIn" onSelect={() => go(links.linkedin)}>
            LinkedIn
            <em className="not-italic text-lime-dim">external</em>
          </CommandItem>
          <CommandItem value="Instagram jidxesh" onSelect={() => go(links.instagram)}>
            Instagram — @jidxesh
            <em className="not-italic text-lime-dim">external</em>
          </CommandItem>
          <CommandItem value="Email" onSelect={() => go(`mailto:${links.email}`)}>
            Email — {links.email}
            <em className="not-italic text-lime-dim">mail</em>
          </CommandItem>
          <CommandItem value="Resume download CV" onSelect={() => go(links.resume)}>
            Download résumé
            <em className="not-italic text-lime-dim">pdf</em>
          </CommandItem>
          <CommandItem value="Job tracker live API" onSelect={() => go(links.liveApi)}>
            Job Tracker — live API
            <em className="not-italic text-lime-dim">external</em>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
