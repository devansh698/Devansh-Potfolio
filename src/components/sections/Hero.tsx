'use client';

import { useCallback, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import { useCompanion } from '@/components/providers/CompanionProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { DeskObject } from '@/components/three/DeskScene';
import Magnetic from '@/components/ui/Magnetic';
import Counter from '@/components/ui/Counter';
import { useTypewriter } from '@/hooks/useTypewriter';
import { SCRIPT } from '@/lib/interaction/script';
import { initTone, playTone } from '@/lib/interaction/tone';
import { profile, stats, typedRoles } from '@/lib/data';

// WebGL stays out of the server render and the initial JS chunk.
const DeskScene = dynamic(() => import('@/components/three/DeskScene'), { ssr: false });

const OBJECT_LABEL: Record<DeskObject, string> = {
  monitor: 'Terminal',
  mug: 'Refill',
  plant: 'Water',
  books: 'TL;DR',
};

// Longest role reserves the typing slot's width so the layout never shifts.
const LONGEST_ROLE = typedRoles.reduce((a, b) => (b.length > a.length ? b : a));

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const { isReady, visitorName, say, celebrate, setTerminalOpen, setTldrOpen, setMood, glideTo } = useCompanion();
  const { theme } = useTheme();
  const typed = useTypewriter(typedRoles, isReady);
  const [hovered, setHovered] = useState<DeskObject | null>(null);
  const [pulses, setPulses] = useState<Record<DeskObject, number>>({ monitor: 0, mug: 0, plant: 0, books: 0 });
  const [found, setFound] = useState<Set<DeskObject>>(() => new Set());

  const activate = useCallback(
    (name: DeskObject) => {
      initTone();
      setPulses((p) => ({ ...p, [name]: p[name] + 1 }));
      setFound((prev) => {
        const next = new Set(prev).add(name);
        if (next.size === 4 && prev.size === 3) {
          setTimeout(() => {
            celebrate('success');
            say('You found everything on the desk. Curious one, aren’t you?');
          }, 900);
        }
        return next;
      });
      say(SCRIPT.desk[name]);
      if (name === 'monitor') {
        playTone('open');
        setTimeout(() => setTerminalOpen(true), 500);
      } else if (name === 'books') {
        playTone('open');
        setTimeout(() => setTldrOpen(true), 450);
      } else {
        playTone('discover');
        setMood('excited', 1600);
      }
    },
    [celebrate, say, setMood, setTerminalOpen, setTldrOpen],
  );

  useGSAP(
    () => {
      if (!isReady) return;
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('[data-hero-name]', { type: 'chars' });

        gsap
          .timeline()
          .from(split.chars, { yPercent: 120, rotationX: -90, transformPerspective: 800, transformOrigin: '50% 100%', stagger: 0.035, duration: 1.2 })
          .from('[data-hero-tag]', { scale: 0, rotate: -40, duration: 0.9, ease: 'back.out(2)' }, 0.5)
          .from('[data-hero-fade]', { y: 24, autoAlpha: 0, stagger: 0.08 }, 0.3);

        // The dive: letters scatter into depth while the camera flies into the monitor (see DeskScene).
        const dive = gsap.timeline({
          defaults: { ease: 'none', duration: 1 },
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            onUpdate: (self) => {
              const previous = progress.current;
              progress.current = self.progress;
              // Whoosh as the dive starts and as it breaks through the screen, in either direction.
              if ((previous < 0.1) !== (self.progress < 0.1) || (previous < 0.85) !== (self.progress < 0.85)) playTone('whoosh');
            },
          },
        });

        dive
          .to(
            split.chars,
            {
              x: () => gsap.utils.random(-600, 600),
              y: () => gsap.utils.random(-500, 200),
              z: () => gsap.utils.random(-1400, -400),
              rotationX: () => gsap.utils.random(-180, 180),
              rotationY: () => gsap.utils.random(-180, 180),
              opacity: 0,
              transformPerspective: 900,
              ease: 'power2.in',
              stagger: { each: 0.015, from: 'center' },
              duration: 0.28,
            },
            0.02,
          )
          .to('[data-hero-tag]', { y: -300, rotate: 60, scale: 2, opacity: 0, duration: 0.25 }, 0.02)
          .to('[data-hero-copy]', { y: -120, opacity: 0, filter: 'blur(8px)', duration: 0.25 }, 0)
          .to('[data-hero-stats], [data-hero-hint]', { y: 60, opacity: 0, duration: 0.2 }, 0)
          .fromTo('[data-dive-caption]', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.15 }, 0.55)
          .to('[data-dive-caption]', { opacity: 0, y: -30, duration: 0.1 }, 0.82)
          .to('[data-dive-flash]', { opacity: 1, duration: 0.12 }, 0.88);

        return () => {
          split.revert();
          progress.current = 0;
        };
      });
    },
    { scope: root, dependencies: [isReady] },
  );

  return (
    <section id="top" ref={root} className="relative h-[280svh] motion-reduce:h-auto" style={{ visibility: isReady ? 'visible' : 'hidden' }}>
      <div className="gutter sticky top-0 flex h-svh flex-col overflow-clip pb-6 pt-24">
        {/* Ambient glow picks up the theme accent. */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-10 size-[48rem] opacity-25 blur-3xl" style={{ background: 'radial-gradient(circle, var(--accent-2), transparent 65%)' }} />

        <div data-cursor={hovered ? OBJECT_LABEL[hovered] : undefined} className="absolute inset-0" style={{ cursor: hovered ? 'pointer' : undefined }}>
          <DeskScene isReady={isReady} palette={theme.palette} pulses={pulses} onHover={setHovered} onActivate={activate} progress={progress} />
        </div>

        <div data-hero-copy className="pointer-events-none relative max-w-[34ch]">
          <p data-hero-fade className="label mb-5 flex items-center gap-2 border-b border-line pb-2 text-muted">
            <span className="size-1.5 bg-accent" />
            {visitorName ? `Hey ${visitorName} — open to new roles` : 'Vol. 01 · Open to new roles'}
          </p>
          <p data-hero-fade className="label text-muted">Currently shipping as</p>
          <p data-hero-fade className="relative mt-1 block whitespace-nowrap font-mono text-base text-accent sm:text-lg">
            <span aria-hidden="true" className="invisible">
              {LONGEST_ROLE}_
            </span>
            <span className="absolute inset-0" aria-live="off">
              {typed}
              <span className="caret">_</span>
            </span>
          </p>
          <p data-hero-fade className="mt-5 hidden max-w-[32ch] text-[0.95rem] leading-relaxed text-muted sm:block">
            {profile.intro}
          </p>
          <div data-hero-fade className="pointer-events-auto mt-7 flex flex-wrap items-center gap-2">
            <Magnetic>
              <button
                type="button"
                data-cursor="Explore"
                onClick={() => glideTo('#work')}
                className="cropped border border-accent bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-on-accent"
              >
                See the work ↗
              </button>
            </Magnetic>
            <button
              type="button"
              onClick={() => glideTo('#contact')}
              className="border border-line px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:bg-fg hover:text-bg"
            >
              Commission me
            </button>
          </div>
        </div>

        <div data-hero-hint className="pointer-events-none absolute right-24 top-24 hidden max-w-[16rem] text-right lg:block">
          <p className="label text-muted">Fig. 01 - the workstation</p>
          <p className="mt-1 max-w-[24ch] font-mono text-[0.68rem] leading-relaxed text-muted">
            monitor → shell · books → tl;dr · mug · plant
          </p>
          <AnimatePresence>
            {isReady && found.size < 4 && (
              <motion.p
                className="label mt-2 flex items-center justify-end gap-2 text-accent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="size-1.5 animate-pulse bg-accent" /> {found.size}/4 found
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <p data-dive-caption className="label pointer-events-none absolute inset-x-0 bottom-10 text-center text-fg opacity-0">
          entering devansh.dev ↓
        </p>

        <div className="pointer-events-none relative mt-auto">
          <div className="relative [perspective:900px]">
            <h1 data-hero-name className="display whitespace-nowrap text-[min(15vw,23svh)] [transform-style:preserve-3d]">
              <span className="block">{profile.firstName}</span>
              <span className="block italic text-accent">{profile.lastName}</span>
            </h1>
            <span
              data-hero-tag
              className="absolute -top-4 right-0 hidden -rotate-3 whitespace-nowrap border border-fg bg-bg px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.16em] md:left-[52%] md:right-auto md:top-[40%] md:inline-block"
            >
              {profile.role} — est. 2025
            </span>
          </div>

          <div data-hero-stats className="mt-6 grid grid-cols-3 items-end gap-3 border-t border-line bg-bg/75 pr-14 pt-3 backdrop-blur-sm md:flex md:justify-between md:bg-transparent md:pr-0 md:backdrop-blur-none">
            {stats.map((s, i) => (
              <div key={s.label} className="flex flex-col items-start gap-0.5 md:flex-row md:items-baseline md:gap-2">
                <span className="label text-accent">{String(i + 1).padStart(2, '0')}</span>
                <Counter to={s.value} suffix={s.suffix} className="display text-3xl tabular-nums md:text-4xl" />
                <span className="label !text-[0.6rem] leading-tight text-muted md:!text-[0.7rem]">{s.label}</span>
              </div>
            ))}
            <p className="label hidden text-muted md:block">↓ scroll — dive into the screen</p>
          </div>
        </div>

        <div data-dive-flash aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg opacity-0" />
      </div>
    </section>
  );
}
