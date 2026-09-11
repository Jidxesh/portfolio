# Jidnesh Chavan — Portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion · shadcn/ui

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Before you deploy

- **Drop your CV at `public/resume.pdf`** — the Download résumé buttons
  (hero, contact, ⌘K) point there. Any other filename means editing
  `links.resume` in `lib/data.ts`.

- `lib/data.ts` holds every piece of content — projects, timeline, stack, links.
  Change copy there, not in the components.
- Add repo URLs for the workflow engine, resume analyzer and chat app —
  they point at your GitHub profile right now.

## Layout

```
app/
  layout.tsx        fonts (next/font) + metadata
  page.tsx          composes the sections, owns preloader + palette state
  globals.css       Tailwind v4 @theme tokens, marquee keyframes
components/
  ui/               shadcn primitives: button, badge, accordion, dialog, command
  preloader.tsx     percentage counter + per-letter reveal + curtain lift
  cursor.tsx        dot + spring-lagged ring
  hero.tsx          name, masked line reveal, rotator, terminal, pipeline
  text-rotator.tsx  fade + slide-up phrase cycling
  scramble-text.tsx wave scramble across the name
  work.tsx          projects as a Radix accordion
  timeline.tsx      scroll-linked progress line
  ...
lib/data.ts         all content
lib/utils.ts        cn() helper
```

## shadcn/ui

`components.json` is configured, so `npx shadcn@latest add <component>` works.
The primitives in `components/ui` were written in shadcn's style and can be
regenerated with the CLI if you prefer.

## Deploy

Push to GitHub, import the repo on Vercel. No environment variables needed.
