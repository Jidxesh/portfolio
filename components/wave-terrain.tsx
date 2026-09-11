"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* ------------------------------------------------------------------
   A wireframe heightfield: a grid of points in world space whose Y is
   driven by layered travelling sine waves, pitched away from the
   camera and projected through FOCAL/(FOCAL+z). Rows and columns are
   stroked as polylines, so the sheet reads as a rippling surface
   rather than a flat grid.

   Cursor yaws and pitches the camera. Scroll drives the surface
   toward you and lifts the swell.
   ------------------------------------------------------------------ */

const COLS = 48;
const ROWS = 30;
const SPAN = 2600;   // world width
const DEPTH = 2300;  // world depth
const FOCAL = 520;

export function WaveTerrain() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let flow = 0;
    let boost = 0;
    let lastScroll = window.scrollY;

    const pointer = { x: 0.5, y: 0.5 };
    const eased = { x: 0.5, y: 0.5 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth;
      pointer.y = e.clientY / window.innerHeight;
    };

    const onScroll = () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      boost = Math.max(-22, Math.min(22, boost + delta * 0.07));
    };

    type P = { x: number; y: number; a: number; height: number };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, now - last) / 1000;
      last = now;
      if (document.hidden) return;

      t += dt;
      boost *= 0.93;
      flow += dt * (120 + Math.abs(boost) * 90);
      eased.x += (pointer.x - eased.x) * 0.05;
      eased.y += (pointer.y - eased.y) * 0.05;

      const yaw = (eased.x - 0.5) * 0.5;
      const pitch = 0.34 + (eased.y - 0.5) * 0.16;
      const swell = 92 + Math.abs(boost) * 5;

      const cx = w / 2;
      const horizon = h * 0.52;
      const camHeight = 190;

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      ctx.clearRect(0, 0, w, h);

      // ---- build the projected grid ----
      const grid: P[][] = [];
      for (let j = 0; j < ROWS; j++) {
        const row: P[] = [];
        // rows travel toward the camera and recycle, so the sheet is endless
        const zWorld = ((j / (ROWS - 1)) * DEPTH + flow) % DEPTH;

        for (let i = 0; i < COLS; i++) {
          const xWorld = ((i / (COLS - 1)) - 0.5) * SPAN;

          // three layered waves at different scales and speeds
          const y =
            Math.sin(xWorld * 0.0035 + t * 0.85) * swell * 0.55 +
            Math.cos(zWorld * 0.0042 - t * 0.62) * swell * 0.5 +
            Math.sin((xWorld + zWorld) * 0.0022 + t * 1.25) * swell * 0.32;

          // yaw, then pitch
          const xr = xWorld * cosY - zWorld * sinY;
          const zr = xWorld * sinY + zWorld * cosY;
          const yr = y * cosP - zr * sinP;
          const zf = y * sinP + zr * cosP + 300;

          if (zf <= 1) {
            row.push({ x: -9999, y: -9999, a: 0, height: 0 });
            continue;
          }

          const scale = FOCAL / (FOCAL + zf);
          row.push({
            x: cx + xr * scale,
            y: horizon + (yr + camHeight) * scale,
            a: Math.max(0, 1 - zf / (DEPTH * 0.95)),
            height: y / swell,
          });
        }
        grid.push(row);
      }

      const stroke = (p: P, q: P, mul: number) => {
        const a = Math.min(p.a, q.a) * mul;
        if (a <= 0.012) return;
        // lime on the crests, cyan in the troughs
        const mix = (p.height + q.height) * 0.5;
        const col =
          mix > 0
            ? `rgba(163,230,53,${a * (0.5 + mix * 0.5)})`
            : `rgba(34,211,238,${a * (0.45 - mix * 0.35)})`;
        ctx.strokeStyle = col;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      };

      ctx.lineWidth = 1;

      // ---- rows ----
      for (let j = 0; j < ROWS; j++) {
        for (let i = 0; i < COLS - 1; i++) {
          stroke(grid[j][i], grid[j][i + 1], 0.5);
        }
      }

      // ---- columns, thinned out so the mesh doesn't turn into soup ----
      for (let i = 0; i < COLS; i += 2) {
        for (let j = 0; j < ROWS - 1; j++) {
          const p = grid[j][i];
          const q = grid[j + 1][i];
          // skip the seam where a row recycles to the back
          if (Math.abs(p.y - q.y) > h * 0.45) continue;
          stroke(p, q, 0.28);
        }
      }

      // ---- crest highlights ----
      for (let j = 0; j < ROWS; j += 2) {
        for (let i = 0; i < COLS; i += 3) {
          const p = grid[j][i];
          if (p.height < 0.72 || p.a <= 0.05) continue;
          ctx.beginPath();
          ctx.fillStyle = `rgba(190,242,100,${p.a * 0.5})`;
          ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ---- atmosphere ----
      const haze = ctx.createLinearGradient(0, horizon - 150, 0, horizon + 90);
      haze.addColorStop(0, "rgba(5,7,6,0.9)");
      haze.addColorStop(0.55, "rgba(132,204,22,0.07)");
      haze.addColorStop(1, "rgba(5,7,6,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, horizon - 150, w, 240);

      const vig = ctx.createRadialGradient(
        cx, horizon, 60,
        cx, horizon, Math.max(w, h) * 0.72
      );
      vig.addColorStop(0, "rgba(5,7,6,0)");
      vig.addColorStop(1, "rgba(5,7,6,0.9)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, w, h);
    };

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduce]);

  if (reduce) return <div className="field" />;

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.7]
                 [mask-image:linear-gradient(180deg,#000_0%,#000_62%,transparent_96%)]
                 [-webkit-mask-image:linear-gradient(180deg,#000_0%,#000_62%,transparent_96%)]"
    />
  );
}
