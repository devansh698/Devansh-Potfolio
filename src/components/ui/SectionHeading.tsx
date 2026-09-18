'use client';

import { useRef, type ReactNode } from 'react';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  /** Set in italic serif after the title — the emphasised half of the phrase. */
  accent?: string;
  meta?: string;
  id?: string;
  aside?: ReactNode;
}

/** Section masthead: a numbered rule, then a display line that flips up on scroll. */
export default function SectionHeading({ index, eyebrow, title, accent, meta, id, aside }: SectionHeadingProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create(root.current!.querySelector('h2'), { type: 'chars' });
        gsap.fromTo(
          split.chars,
          { rotationX: -100, yPercent: 60, z: -120, opacity: 0, transformOrigin: '50% 100% -30px', transformPerspective: 700 },
          {
            rotationX: 0,
            yPercent: 0,
            z: 0,
            opacity: 1,
            ease: 'power2.out',
            stagger: 0.035,
            scrollTrigger: { trigger: root.current, start: 'top 92%', end: 'top 45%', scrub: 0.6 },
          },
        );
        gsap.from('[data-heading-rule]', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: { trigger: root.current, start: 'top 88%' },
        });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mb-10 md:mb-14">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="label text-accent">§ {index}</span>
        <span className="label text-muted">{eyebrow}</span>
        <span data-heading-rule className="leader" />
        {meta && <span className="label text-muted">{meta}</span>}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id={id} className="display text-[clamp(2.8rem,9vw,8rem)]">
          {title}
          {accent && <em className="text-accent"> {accent}</em>}
        </h2>
        {aside}
      </div>
    </div>
  );
}
