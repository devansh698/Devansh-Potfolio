'use client';

import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { roles } from '@/lib/data';

export default function Experience() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Horizontal pinned track only where there's room and motion is welcome.
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current;
        if (!el) return;
        const distance = () => el.scrollWidth - window.innerWidth;

        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });

        gsap.to('[data-exp-progress]', {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: () => `+=${distance()}`, scrub: true },
        });

        gsap.utils.toArray<HTMLElement>('[data-exp-card]').forEach((card) => {
          gsap.from(card.querySelectorAll('[data-exp-reveal]'), {
            y: 40,
            autoAlpha: 0,
            stagger: 0.06,
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 80%' },
          });
          gsap.fromTo(
            card.querySelector('[data-exp-inner]'),
            { rotationY: -38, z: -160, transformPerspective: 1200, transformOrigin: '0% 50%', opacity: 0.35 },
            { rotationY: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 35%', scrub: true } },
          );
          gsap.fromTo(
            card.querySelector('[data-exp-num]'),
            { xPercent: 30 },
            { xPercent: -30, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="experience" ref={root} aria-labelledby="experience-title" className="relative overflow-clip bg-surface lg:h-svh">
      <div ref={track} className="flex h-full flex-col lg:w-max lg:flex-row">
        <div className="gutter flex flex-col justify-between py-20 lg:w-[40vw] lg:py-24">
          <p className="label flex items-center gap-3 text-muted">
            <span className="text-accent">04</span>
            <span className="h-px w-8 bg-line" />
            Experience
          </p>
          <h2 id="experience-title" className="display mt-8 text-[clamp(2.8rem,6.4vw,7.5rem)] leading-[0.82]">
            Where I&apos;ve
            <br />
            <span className="text-accent">shipped</span>
          </h2>
          <p className="mt-8 max-w-[32ch] text-muted">
            Production work first. <span className="hidden lg:inline">Keep scrolling — the timeline moves sideways →</span>
          </p>
        </div>

        {roles.map((role) => (
          <article key={role.code} data-exp-card className="gutter relative flex flex-col overflow-hidden border-t border-line py-14 lg:w-[48vw] lg:justify-center lg:border-l lg:border-t-0 lg:px-12 lg:py-24">
            <span data-exp-num aria-hidden="true" className="display pointer-events-none absolute -bottom-8 right-0 select-none text-[clamp(8rem,18vw,18rem)] leading-none text-fg/[0.04]">
              {role.code.slice(-2)}
            </span>
            <div data-exp-inner>
            <div data-exp-reveal className="flex items-baseline justify-between">
              <span className="label bg-accent px-3 py-1 text-on-accent">{role.period}</span>
              <span className="label text-muted">{role.code}</span>
            </div>
            <h3 data-exp-reveal className="display pt-10 text-[clamp(2rem,3.6vw,3.6rem)] font-bold uppercase leading-[0.9]">
              {role.title}
            </h3>
            <p data-exp-reveal className="mt-3 text-xl">
              <span className="mr-2 inline-block size-2.5 bg-accent-2 align-middle" />
              {role.org}
            </p>
            <ul data-exp-reveal className="mt-8 space-y-3 border-t border-line pt-6">
              {role.points.map((point) => (
                <li key={point} className="flex max-w-[52ch] gap-3 leading-relaxed text-fg/85">
                  <span className="text-accent">→</span>
                  {point}
                </li>
              ))}
            </ul>
            <div data-exp-reveal className="mt-8 flex flex-wrap gap-2">
              {role.stack.map((t) => (
                <span key={t} className="border border-line px-3 py-1 text-sm">
                  {t}
                </span>
              ))}
            </div>
            </div>
          </article>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 hidden h-1 bg-line lg:block">
        <div data-exp-progress className="h-full origin-left scale-x-0 bg-accent" />
      </div>
    </section>
  );
}
