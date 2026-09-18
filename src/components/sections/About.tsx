'use client';

import { useRef, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { gsap, SplitText, useGSAP } from '@/lib/gsap';
import SectionHeading from '@/components/ui/SectionHeading';
import { spotlight } from '@/lib/spotlight';
import { caseFile, education, profile } from '@/lib/data';
import { useCompanion } from '@/components/providers/CompanionProvider';

function CaseFile() {
  const { celebrate, say } = useCompanion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(useTransform(ry, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(rx, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    spotlight(e);
    const r = e.currentTarget.getBoundingClientRect();
    rx.set((e.clientX - r.left) / r.width - 0.5);
    ry.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <div data-about-swing className="[perspective:1000px]">
      <motion.div
        data-about-card
        onPointerMove={onMove}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="spotlight relative border border-line bg-surface p-6 sm:p-8"
      >
        <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
          <span className="label">Case file</span>
          <span className="label text-muted">#DH-2026</span>
        </div>
        <dl className="space-y-3">
          {caseFile.map((f) => (
            <div key={f.k} className="flex justify-between gap-6 border-b border-dashed border-line pb-3">
              <dt className="label text-muted">{f.k}</dt>
              <dd className="text-right font-medium">{f.v}</dd>
            </div>
          ))}
        </dl>
        <motion.button
          type="button"
          data-cursor="Stamp"
          onClick={() => {
            celebrate('discover');
            say('Verified. He’s the real deal.');
          }}
          whileTap={{ scale: 0.85, rotate: -20 }}
          className="display absolute -right-3 -top-4 rotate-12 border-2 border-accent bg-bg px-3 py-1 text-sm text-accent"
          style={{ transform: 'translateZ(40px)' }}
        >
          Verified
        </motion.button>
      </motion.div>
    </div>
  );
}

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const split = SplitText.create('[data-statement]', { type: 'words' });
        gsap.fromTo(
          split.words,
          { opacity: 0.15 },
          { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: '[data-statement]', start: 'top 80%', end: 'bottom 50%', scrub: true } },
        );
        gsap.fromTo(
          '[data-about-swing]',
          { rotationY: -55, rotationX: 18, z: -200, opacity: 0, transformPerspective: 1100, transformOrigin: '100% 50%' },
          { rotationY: 0, rotationX: 0, z: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '[data-about-grid]', start: 'top 85%', end: 'top 30%', scrub: 0.6 } },
        );
        gsap.from('[data-edu]', { y: 80, rotationX: -30, transformPerspective: 900, autoAlpha: 0, scrollTrigger: { trigger: '[data-edu]', start: 'top 95%', end: 'top 60%', scrub: 0.6 } });
        return () => split.revert();
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} aria-labelledby="about-title" className="gutter relative py-[clamp(6rem,12vw,10rem)]">
      <SectionHeading index="01" eyebrow="The person" title="About" accent="me" meta="Profile" id="about-title" />

      <div data-about-grid className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p data-statement className="display text-[clamp(1.7rem,3.4vw,3.2rem)] leading-[1.08]">
            I’m <span className="text-accent">{profile.name}</span> — a full-stack developer who went from intern to Software Engineer at{' '}
            {profile.company} in under a year. {profile.statement}
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {['React', 'Node.js', 'Laravel', 'Flask', 'MongoDB', 'MySQL', 'AWS', 'WebSockets'].map((t) => (
              <motion.span
                key={t}
                whileHover={{ y: -4, rotate: -3 }}
                className="border border-line px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                {t}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-5">
          <CaseFile />
          <div data-edu className="border border-line p-6 sm:p-8">
            <p className="label mb-4 text-muted">Education</p>
            <ul className="space-y-4">
              {education.map((e) => (
                <li key={e.title} className="grid grid-cols-[6.5rem_1fr] gap-4">
                  <span className="label pt-1 text-accent">{e.period}</span>
                  <span>
                    <span className="block font-semibold leading-tight">{e.title}</span>
                    <span className="text-sm text-muted">{e.org}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
