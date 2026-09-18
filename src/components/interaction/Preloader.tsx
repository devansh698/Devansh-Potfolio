'use client';

import { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { useCompanion } from '@/components/providers/CompanionProvider';
import { profile } from '@/lib/data';

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [isGone, setIsGone] = useState(false);
  const { finishPreload } = useCompanion();

  useGSAP(
    () => {
      const finish = () => {
        window.scrollTo(0, 0);
        finishPreload();
        setIsGone(true);
      };

      const mm = gsap.matchMedia();
      mm.add({ reduce: '(prefers-reduced-motion: reduce)', ok: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
        if (ctx.conditions?.reduce) {
          gsap.to(root.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
          return;
        }
        const count = { v: 0 };
        gsap
          .timeline({ onComplete: finish })
          .from('[data-pl-word]', { yPercent: 110, stagger: 0.08, duration: 1 })
          .to(
            count,
            {
              v: 100,
              duration: 1.5,
              ease: 'power2.inOut',
              onUpdate: () => {
                if (counter.current) counter.current.textContent = String(Math.round(count.v)).padStart(3, '0');
              },
            },
            0,
          )
          .to('[data-pl-bar]', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
          .to('[data-pl-inner]', { yPercent: -20, autoAlpha: 0, duration: 0.5, ease: 'power3.in' }, '+=0.1')
          .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.2');
      });
    },
    { scope: root },
  );

  if (isGone) return null;

  return (
    <div
      ref={root}
      className="gutter fixed inset-0 z-[100] flex flex-col bg-surface text-fg"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      aria-hidden="true"
    >
      <div data-pl-inner className="flex flex-1 flex-col justify-end pb-8">
        <div className="flex items-end justify-between gap-6">
          <p className="display flex gap-[0.25em] overflow-clip text-[clamp(2.5rem,9vw,8rem)] leading-[0.85]">
            <span data-pl-word className="inline-block">
              {profile.firstName}
            </span>
            <span data-pl-word className="inline-block text-accent">
              {profile.lastName}
            </span>
          </p>
          <span ref={counter} className="label !text-base tabular-nums text-muted">
            000
          </span>
        </div>
        <div className="mt-6 h-px bg-line">
          <div data-pl-bar className="h-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
    </div>
  );
}
