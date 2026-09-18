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
