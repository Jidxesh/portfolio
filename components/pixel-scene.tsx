"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------
   A tiny 8-bit side-scroller drawn pixel by pixel on canvas.
   Sprites are string grids, one character per pixel, mapped through a
   palette. Everything renders in logical pixels and the context is
   scaled up with smoothing off, so it stays crisp and blocky.
   Click or press space to jump; head-butt the block for a coin.
   ------------------------------------------------------------------ */

const W = 150;
const H = 96;
const SCALE = 3;
const GROUND = 78;

const PALETTE: Record<string, string> = {
  H: "#BEF264", // helmet
  B: "#A3E635", // body
  C: "#22D3EE", // visor + arms
  D: "#0A0F0B", // dark
  S: "#808E83", // boots
  Y: "#84CC16", // coin
};

// 8 wide, 12 tall
const RUN_A = [
  "..HHHH..",
  ".HHHHHH.",
  ".HCCCCH.",
  ".HHHHHH.",
  "..BBBB..",
  ".BBBBBB.",
  "CBBBBBBC",
  ".BBBBBB.",
  "..B..B..",
  "..B..B..",
  ".SS..SS.",
  "SS....SS",
];

const RUN_B = [
  "..HHHH..",
  ".HHHHHH.",
  ".HCCCCH.",
  ".HHHHHH.",
  "..BBBB..",
  ".BBBBBB.",
  "CBBBBBBC",
  ".BBBBBB.",
  "...BB...",
  "...BB...",
  "..SSSS..",
  ".SS..SS.",
];

const JUMP = [
  "..HHHH..",
  ".HHHHHH.",
  ".HCCCCH.",
  ".HHHHHH.",
  "C.BBBB.C",
  "CBBBBBBC",
  ".BBBBBB.",
  ".BBBBBB.",
  "..B..B..",
  ".SS..SS.",
  "SS....SS",
  "........",
];

const COIN = ["..YY..", ".YDDY.", "YD..DY", "YD..DY", ".YDDY.", "..YY.."];

function blit(
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  x: number,
  y: number,
  squash = 1
) {
  for (let j = 0; j < sprite.length; j++) {
    for (let i = 0; i < sprite[j].length; i++) {
      const colour = PALETTE[sprite[j][i]];
      if (!colour) continue;
      ctx.fillStyle = colour;
      const w = squash;
      ctx.fillRect(
        Math.round(x + i * squash + (1 - squash) * 4),
        Math.round(y + j),
        Math.max(1, w),
        1
      );
    }
  }
}

export function PixelScene() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [coins, setCoins] = useState(0);
  const jumpRef = useRef<() => void>(() => {});
  const reduce = useReducedMotion();

  const onJump = useCallback(() => jumpRef.current(), []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * SCALE * dpr;
    canvas.height = H * SCALE * dpr;
    ctx.setTransform(SCALE * dpr, 0, 0, SCALE * dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    let last = performance.now();
    let t = 0;
    let scroll = 0;
    let boost = 0;
    let lastScroll = window.scrollY;

    // hero physics
    let y = 0; // offset above ground
    let vy = 0;
    let frame = 0;

    const blocks = [40, 96];
    const bump = [0, 0];
    const sparks: { x: number; y: number; vy: number; life: number }[] = [];
    const stars = Array.from({ length: 16 }, () => ({
      x: Math.random() * W,
      y: Math.random() * 46,
      s: Math.random() > 0.6 ? 2 : 1,
    }));

    jumpRef.current = () => {
      if (y === 0) vy = 62;
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const el = document.activeElement;
      if (el && el.getAttribute("data-pixel") === "true") {
        e.preventDefault();
        jumpRef.current();
      }
    };

    const onScroll = () => {
      const d = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      boost = Math.max(-40, Math.min(40, boost + d * 0.4));
    };

    const frameLoop = (now: number) => {
      raf = requestAnimationFrame(frameLoop);
      const dt = Math.min(50, now - last) / 1000;
      last = now;
      if (document.hidden) return;

      t += dt;
      boost *= 0.92;
      const speed = 26 + Math.abs(boost);
      if (!reduce) scroll += dt * speed;

      // physics
      vy -= 200 * dt;
      y += vy * dt;
      if (y <= 0) {
        y = 0;
        vy = 0;
      }
      frame = Math.floor(t * 9) % 2;

      const heroX = 30;
      const heroY = GROUND - 12 - y;

      // block head-butt
      blocks.forEach((bx, i) => {
        const screenX = ((bx - scroll * 0.0) % W);
        void screenX;
        const dist = Math.abs(heroX + 4 - bx - 4);
        if (dist < 7 && vy > 0 && heroY < GROUND - 26 && bump[i] <= 0) {
          bump[i] = 1;
          sparks.push({ x: bx + 3, y: GROUND - 34, vy: 34, life: 1 });
          setCoins((c) => c + 1);
        }
        if (bump[i] > 0) bump[i] = Math.max(0, bump[i] - dt * 4);
      });

      // ---------- draw ----------
      ctx.clearRect(0, 0, W, H);

      // sky
      const sky = ctx.createLinearGradient(0, 0, 0, GROUND);
      sky.addColorStop(0, "#070B08");
      sky.addColorStop(1, "#0D1510");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, GROUND);

      // stars
      for (const s of stars) {
        ctx.fillStyle = "rgba(163,230,53,0.35)";
        ctx.fillRect(s.x, s.y, s.s, s.s);
      }

      // far hills, slow parallax
      ctx.fillStyle = "#101A12";
      for (let i = -1; i < 5; i++) {
        const hx = ((i * 56 - scroll * 0.25) % (W + 60)) - 30;
        for (let k = 0; k < 16; k++) {
          ctx.fillRect(hx + k, GROUND - 6 - k, 32 - k * 2, 2);
        }
      }

      // pipes, mid parallax
      ctx.fillStyle = "#16301F";
      for (let i = 0; i < 3; i++) {
        const px = ((i * 70 - scroll * 0.55) % (W + 70)) - 20;
        ctx.fillRect(px, GROUND - 14, 12, 14);
        ctx.fillRect(px - 2, GROUND - 18, 16, 5);
      }

      // question blocks
      blocks.forEach((bx, i) => {
        const by = GROUND - 30 - bump[i] * 4;
        ctx.fillStyle = "#4D7C0F";
        ctx.fillRect(bx, by, 10, 10);
        ctx.fillStyle = "#A3E635";
        ctx.fillRect(bx + 1, by + 1, 8, 8);
        ctx.fillStyle = "#0A0F0B";
        ctx.fillRect(bx + 4, by + 3, 2, 1);
        ctx.fillRect(bx + 6, by + 4, 1, 1);
        ctx.fillRect(bx + 4, by + 5, 2, 1);
        ctx.fillRect(bx + 4, by + 7, 2, 1);
      });

      // coins flying up
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.y -= s.vy * dt;
        s.vy -= 60 * dt;
        s.life -= dt * 0.8;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        const squash = Math.abs(Math.sin(t * 8)) * 0.8 + 0.2;
        blit(ctx, COIN, s.x, s.y, squash);
      }

      // ground: two tone bricks, scrolling
      ctx.fillStyle = "#16201A";
      ctx.fillRect(0, GROUND, W, H - GROUND);
      const tile = 8;
      const off = Math.floor(scroll) % tile;
      for (let x = -off; x < W; x += tile) {
        ctx.fillStyle = "#1E2A20";
        ctx.fillRect(x, GROUND, tile - 1, 3);
        ctx.fillStyle = "#243328";
        ctx.fillRect(x + 2, GROUND + 4, tile - 4, 2);
      }
      ctx.fillStyle = "#A3E635";
      ctx.fillRect(0, GROUND - 1, W, 1);

      // the runner
      const sprite = y > 0 ? JUMP : frame === 0 ? RUN_A : RUN_B;
      blit(ctx, sprite, heroX, heroY);

      // soft glow under the feet
      ctx.fillStyle = "rgba(163,230,53,0.16)";
      ctx.fillRect(heroX, GROUND - 1, 8, 1);
    };

    raf = requestAnimationFrame(frameLoop);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  return (
    <div className="hidden select-none lg:block">
      <button
        type="button"
        data-pixel="true"
        onClick={onJump}
        aria-label="Make the character jump"
        className="block w-full cursor-pointer rounded-lg border border-line bg-surface/60 p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime"
      >
        <canvas
          ref={ref}
          className="w-full [image-rendering:pixelated]"
          style={{ aspectRatio: `${W} / ${H}` }}
        />
      </button>

      <div className="mt-2.5 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>click or space to jump — hit the blocks</span>
        <span className="text-lime">coins × {coins}</span>
      </div>
    </div>
  );
}
