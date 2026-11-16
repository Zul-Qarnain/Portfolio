# Mohammad Shihab Hossain — Portfolio

Personal portfolio of **Mohammad Shihab Hossain**, AI & Software Developer.
Projects, research publications, achievements, skills, and articles on machine learning and full-stack development.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-2-3ECF8E?logo=supabase&logoColor=black)

## Features

- Hero, skills showcase, featured projects, achievements, publications, events
- Blog with Markdown posts, tags, RSS feed (`/feed.xml`), sitemap, and SEO metadata + JSON-LD
- Contact form, visit tracking, theme support, admin editor (TipTap)
- PWA manifest, robots.txt, IndexNow submission script

## Tech stack

- **Framework:** Next.js 15 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, Radix UI, Lucide icons
- **Data:** Supabase (`@supabase/ssr` + `supabase-js`), TanStack Query
- **Content:** Markdown (`marked`), TipTap editor
- **Quality:** ESLint, `tsc --noEmit`, Vitest, Playwright smoke test

## Getting started

Requirements: Node.js 20+, npm.

```bash
npm install
cp .env.local.example .env.local  # if present, else create it (see below)
npm run dev
```

Open http://localhost:9002.

Minimal `.env.local` (add only what you use):

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:9002
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server on port 9002 |
| `npm run build` / `npm run start` | Production build / serve it |
| `npm run lint` / `npm run typecheck` | Next lint / `tsc --noEmit` |
| `npm run test` | Unit tests (Vitest) |
| `npm run test:smoke` | Smoke test (`scripts/smoke.mjs`) |
| `npm run indexnow` | Submit URLs to IndexNow |

## Project structure

```
src/app/          # App Router pages (home, projects, posts, contact, api, …)
src/components/   # UI + home sections + contact + providers
src/lib/          # data, posts, SEO, schema helpers
data/             # local content / assets
public/           # static files, resume.pdf, icons, robots.txt
scripts/          # smoke test, IndexNow submit
supabase/         # Supabase config / migrations
```

## SEO & content

- Per-page metadata, canonical URLs, Open Graph, `sitemap.ts`, `manifest.ts`
- `public/robots.txt`, `public/llms.txt`, RSS at `src/app/feed.xml/route.ts`
- Blog posts live under `src/app/posts/` — add Markdown to publish

## Deployment

Any Node host works (Vercel recommended):

```bash
npm run build
npm run start
```

Set production env vars (`NEXT_PUBLIC_SITE_URL`, Supabase keys) in the host dashboard.

## Author

**Mohammad Shihab Hossain** — AI & Software Developer.
See `public/resume.pdf` for the full CV.
