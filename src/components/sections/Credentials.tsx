'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import { gsap, useGSAP } from '@/lib/gsap';
import { playTone } from '@/lib/interaction/tone';
import { courses, specializations, type Credential } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;

const SHELVES = [
  { id: 'spec', label: 'Shelf A — Specializations', items: specializations },
  { id: 'courses', label: 'Shelf B — Verified courses', items: courses },
] as const;

/** Stable pseudo-random from the title so each book keeps its own size and binding. */
function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) % 9973;
  return h;
}

type Binding = 'cloth' | 'ink' | 'paper';

function bookOf(item: Credential) {
  const h = hash(item.title);
  const bindings: Binding[] = ['cloth', 'ink', 'paper'];
  const short = shortTitle(item.title);
  return {
    binding: bindings[h % 3],
    width: 66 + (h % 4) * 14, // 66–108px spines
    // Tall enough for the vertical title, plus a little variety.
    height: Math.min(330, 190 + short.length * 5 + ((h >> 2) % 4) * 14),
    // Long titles get set smaller so they never run off the spine.
    type: short.length > 26 ? 'text-[0.78rem]' : short.length > 18 ? 'text-[0.88rem]' : 'text-[1rem]',
    tilt: (h >> 3) % 7 === 0, // the odd book leans
  };
}

function shortTitle(title: string): string {
  return title.replace(/ (Specialization|Professional Certificate)$/, '');
}

const BINDING_CLASS: Record<Binding, string> = {
  cloth: 'bg-surface-2 text-fg border-line',
  ink: 'bg-accent text-on-accent border-accent',
  paper: 'bg-bg text-fg border-line',
};

function Book({
  item,
  index,
  isActive,
  onHover,
}: {
  item: Credential;
  index: number;
  isActive: boolean;
  onHover: (item: Credential | null) => void;
}) {
  const { binding, width, height, tilt, type } = bookOf(item);
  const short = shortTitle(item.title);

  return (
    <motion.a
      data-book
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="Read"
      aria-label={`${item.title} — ${item.org}${item.date ? `, ${item.date}` : ''}`}
      onPointerEnter={() => {
        onHover(item);
        playTone('hover');
      }}
      onFocus={() => onHover(item)}
      onPointerLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      style={{ width, height, transformOrigin: 'bottom center' }}
      animate={{ y: isActive ? -18 : 0, rotate: isActive ? -3 : tilt ? 4 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      className={`relative flex shrink-0 flex-col items-center justify-between border px-2 py-3 shadow-[3px_0_0_rgb(0_0_0/0.08)] ${BINDING_CLASS[binding]}`}
    >
      {/* head band */}
      <span aria-hidden="true" className={`h-1 w-full ${binding === 'ink' ? 'bg-on-accent/60' : 'bg-accent'}`} />

      <span
        className={`display flex-1 overflow-hidden py-3 text-center leading-tight ${type}`}
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        {short}
      </span>

      <span className="flex w-full flex-col items-center gap-1.5">
        <span aria-hidden="true" className={`h-px w-full ${binding === 'ink' ? 'bg-on-accent/50' : 'bg-line'}`} />
        <span className="w-full truncate text-center font-mono text-[0.5rem] uppercase tracking-[0.1em] opacity-70">{item.org.split(' ')[0]}</span>
        <span className="font-mono text-[0.55rem] tabular-nums opacity-60">{String(index + 1).padStart(2, '0')}</span>
      </span>
    </motion.a>
  );
}

function Shelf({
  label,
  items,
  offset,
  onHover,
  active,
}: {
  label: string;
  items: readonly Credential[];
  offset: number;
  onHover: (item: Credential | null) => void;
  active: Credential | null;
}) {
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-baseline gap-3">
        <span className="label text-muted">{label}</span>
        <span className="leader" />
        <span className="label text-muted">{String(items.length).padStart(2, '0')} vols.</span>
      </div>

      <div className="relative">
        <div
          data-lenis-prevent
          className="flex items-end gap-1.5 overflow-x-auto pb-1 pt-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* bookend */}
          <span aria-hidden="true" className="mr-1 h-16 w-3 shrink-0 self-end border border-line bg-surface-2" />
          {items.map((item, i) => (
            <Book key={item.url} item={item} index={offset + i} isActive={active?.url === item.url} onHover={onHover} />
          ))}
          <span aria-hidden="true" className="ml-1 h-20 w-16 shrink-0 origin-bottom-left -rotate-[14deg] self-end border border-line bg-surface-2" />
          <span aria-hidden="true" className="ml-3 flex shrink-0 flex-col justify-end gap-1 self-end">
            <span className="h-3 w-24 border border-line bg-bg" />
            <span className="h-3 w-28 border border-line bg-surface-2" />
            <span className="h-4 w-24 border border-accent bg-accent" />
          </span>
          <span aria-hidden="true" className="ml-auto h-24 w-3 shrink-0 self-end border border-line bg-surface-2" />
        </div>

        {/* the plank */}
        <div aria-hidden="true" className="h-2 w-full border-x border-b border-line bg-surface-2 shadow-[0_6px_10px_-6px_rgb(0_0_0/0.35)]" />
      </div>
    </div>
  );
}

export default function Credentials() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Credential | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Books get shelved as the section arrives.
        gsap.from('[data-book]', {
          y: -60,
          rotate: () => gsap.utils.random(-12, 12),
          opacity: 0,
          stagger: 0.04,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: '[data-shelves]', start: 'top 80%' },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="certs" ref={root} aria-labelledby="certs-title" className="gutter relative py-[clamp(6rem,12vw,10rem)]">
      <SectionHeading
        index="05"
        eyebrow="The shelf"
        title="Credent"
        accent="ials"
        meta={`${specializations.length + courses.length} volumes`}
        id="certs-title"
        aside={
          <p className="max-w-[26ch] text-sm leading-relaxed text-muted">
            Everything studied, bound and shelved. Pull a spine to open its certificate.
          </p>
        }
      />

      <div data-shelves>
        {SHELVES.map((shelf, i) => (
          <Shelf
            key={shelf.id}
            label={shelf.label}
            items={shelf.items}
            offset={i === 0 ? 0 : SHELVES[0].items.length}
            onHover={setActive}
            active={active}
          />
        ))}
      </div>

      {/* Reading label for the book currently pulled out */}
      <div className="min-h-[5.5rem] border-t border-line pt-4">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key={active.url}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="flex flex-wrap items-baseline gap-x-4 gap-y-1"
            >
              <span className="label text-accent">Now reading</span>
              <span className="display text-[clamp(1.2rem,2.6vw,2rem)]">{active.title}</span>
              <span className="leader hidden sm:block" />
              <span className="text-sm text-muted">{active.org}</span>
              <span className="label text-muted">{active.date ?? 'verified'}</span>
              <span className="label text-accent">open ↗</span>
            </motion.div>
          ) : (
            <motion.p key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="label text-muted">
              Hover a spine to read its label · tap to open the certificate
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
