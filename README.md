# Devansh Handa — Portfolio

Next.js 16 · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis · Framer Motion · React Three Fiber

```bash
npm install
cp .env.example .env.local   # add your Web3Forms key
npm run dev
```

- Content: `src/lib/data.ts`. Companion lines: `src/lib/interaction/script.ts`.
- Themes (Midnight / Paper / Ember): tokens in `src/app/globals.css`, 3D palette mirror in `ThemeProvider.tsx`.
- Interaction layer (`src/components/interaction`): preloader, first-visit intro, companion bot, terminal (`` ` `` or Ctrl/⌘+K), case-study modal, TL;DR sheet, custom cursor, section/scroll/idle senses.
- Hero desk (`src/components/three/DeskScene.tsx`) is built from primitives, lazy-loaded, pauses off-screen; monitor → terminal, books → TL;DR, mug/plant react.
- Motion: GSAP owns scroll choreography, Framer Motion owns UI state motion, Lenis owns smooth scroll. Everything respects `prefers-reduced-motion`.
- SEO: set `NEXT_PUBLIC_SITE_URL` (canonical origin; on Vercel it falls back to the production domain). Metadata in `src/app/layout.tsx`, shared config in `src/lib/site.ts` — bump `CONTENT_UPDATED_AT` after content edits. Generated routes: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, OG images, `/projects/[slug]` case studies, JSON-LD (`src/lib/seo/structured-data.ts`).
- AI crawlers: `/llms.txt` and `/llms-full.txt` (https://llmstxt.org) are generated from `src/lib/data.ts`; robots.txt explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others.
