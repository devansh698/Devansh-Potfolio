'use client';

import { useRef } from 'react';
import { useLenis } from 'lenis/react';
import { gsap, useGSAP } from '@/lib/gsap';
import { ticker } from '@/lib/data';

/** Two opposing rules of running type; speed and direction follow scroll velocity. */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const tweens = useRef<gsap.core.Tween[]>([]);
  const skew = useRef<((v: number) => void) | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        tweens.current = gsap.utils.toArray<HTMLElement>('[data-track]').map((el, i) =>
          gsap.fromTo(el, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 44, ease: 'none', repeat: -1 }),
        );
        skew.current = gsap.quickTo('[data-track]', 'skewX', { duration: 0.4, ease: 'power3' });
        return () => {
          tweens.current = [];
          skew.current = null;
        };
      });
    },
    { scope: root },
  );

  useLenis(({ velocity, direction }) => {
    const boost = 1 + Math.min(Math.abs(velocity) / 6, 6);
    tweens.current.forEach((t) => t.timeScale(boost * (direction < 0 ? -1 : 1)));
    skew.current?.(gsap.utils.clamp(-8, 8, velocity * -0.3));
  });

  const row = [...ticker, ...ticker];

  return (
    <div ref={root} aria-hidden="true" className="relative overflow-hidden border-y border-line py-3">
      <div className="overflow-hidden py-1">
        <div data-track className="flex w-max items-baseline gap-6 whitespace-nowrap will-change-transform">
          {row.map((word, j) => (
            <span key={`${word}-${j}`} className="flex items-baseline gap-6">
              <span className="display text-[clamp(1.4rem,3.4vw,2.6rem)]">{word}</span>
              <span className="label text-accent">◆</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-2 overflow-hidden border-t border-line py-1">
        <div data-track className="flex w-max items-baseline gap-6 whitespace-nowrap will-change-transform">
          {row.map((word, j) => (
            <span key={`${word}-${j}`} className="flex items-baseline gap-6">
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-muted">{word}</span>
              <span className="label text-muted">/</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
