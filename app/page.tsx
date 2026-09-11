"use client";

import { useCallback, useState } from "react";
import { Preloader } from "@/components/preloader";
import { Cursor } from "@/components/cursor";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { About } from "@/components/about";
import { Work } from "@/components/work";
import { CaseStudy } from "@/components/case-study";
import { Stack } from "@/components/stack";
import { Timeline } from "@/components/timeline";
import { Snake } from "@/components/snake";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { CommandPalette } from "@/components/command-palette";
import { Statement } from "@/components/statement";
import { SectionRail } from "@/components/section-rail";
import { ParallaxBackdrop } from "@/components/parallax-backdrop";
import { marqueeHabits, marqueeTech } from "@/lib/data";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const onDone = useCallback(() => setReady(true), []);

  return (
    <>
      <Preloader onDone={onDone} />
      <Cursor />
      <ParallaxBackdrop />

      <Nav onOpenPalette={() => setPaletteOpen(true)} />
      <SectionRail />

      <main id="top">
        <Hero ready={ready} />
        <Marquee items={marqueeTech} />
        <About />
        <Statement />
        <Work />
        <CaseStudy />
        <Marquee items={marqueeHabits} baseVelocity={-2} />
        <Stack />
        <Timeline />
        <Snake />
        <Contact />
        <Footer />
      </main>

      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </>
  );
}
