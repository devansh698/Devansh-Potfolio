'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import ProjectCover from '@/components/ui/ProjectCover';
import { playTone } from '@/lib/interaction/tone';
import type { Project } from '@/lib/data';

interface ProjectRingProps {
  projects: Project[];
  onOpen: (p: Project) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Projects mounted on a 3D carousel. The section sticks while scroll turns the ring;
 * scroll velocity tips the ring back like a spinning record.
 */
export default function ProjectRing({ projects, onOpen }: ProjectRingProps) {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const tilt = useRef<((v: number) => void) | null>(null);

  const count = projects.length;
  const step = 360 / count;
  // Radius from card width (in rem) so neighbours don't intersect; floor keeps 2–3 cards readable.
  const radius = Math.max(16, 10.5 / Math.tan(Math.PI / count));
  const current = projects[active] ?? projects[0];

  useGSAP(
    () => {
      gsap.set(ring.current, { rotationY: 0 });
      gsap.to(ring.current, {
        rotationY: -step * (count - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          onUpdate: (self) => {
            const next = Math.round(self.progress * (count - 1));
            if (next !== activeRef.current) {
              activeRef.current = next;
              setActive(next);
              playTone('hover');
            }
          },
        },
      });
      tilt.current = gsap.quickTo(ring.current, 'rotationX', { duration: 0.6, ease: 'power3' });
      ScrollTrigger.refresh();
      return () => {
        tilt.current = null;
      };
    },
    { scope: root, dependencies: [count] },
  );

  useLenis(({ velocity }) => tilt.current?.(gsap.utils.clamp(-18, 18, velocity * 0.6)));

  return (
    <div ref={root} className="relative" style={{ height: `${count * 70 + 100}svh` }}>
      <div className="sticky top-0 grid h-svh items-center overflow-hidden lg:grid-cols-12">
        <div className="relative z-10 order-2 pb-10 lg:order-1 lg:col-span-4 lg:pb-0">
          <div className="mb-6 flex items-center gap-3">
            {projects.map((p, i) => (
              <span key={p.id} className={`h-1 transition-all duration-500 ${i === active ? 'w-10 bg-accent' : 'w-3 bg-line'}`} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={current.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: EASE }}>
              <p className="label text-muted">
                {current.code} · {current.category} · {current.period}
              </p>
              <h3 className="display mt-3 text-[clamp(2rem,4vw,3.6rem)] leading-[0.88]">{current.title}</h3>
              <p className="mt-2 text-accent">{current.kind}</p>
              <p className="mt-4 hidden max-w-[40ch] leading-relaxed text-muted sm:block">{current.desc}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {current.stack.map((t) => (
                  <span key={t} className="border border-line px-2.5 py-0.5 text-xs">
                    {t}
                  </span>
                ))}
              </div>
              <button
                type="button"
                data-cursor="Open"
                onClick={() => onOpen(current)}
                className="mt-6 bg-accent px-6 py-3 font-semibold text-on-accent transition-transform hover:scale-[1.03]"
              >
                Explore case study ↗
              </button>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative order-1 h-[52svh] [perspective:1400px] lg:order-2 lg:col-span-8 lg:h-full">
          <div ref={ring} className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
            {projects.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onOpen(p)}
                tabIndex={i === active ? 0 : -1}
                aria-label={`Open ${p.title} case study`}
                data-cursor="Open"
                className="absolute left-0 top-0 aspect-[4/5] w-[min(18rem,62vw)] overflow-hidden border border-line shadow-2xl [backface-visibility:hidden] transition-[filter] duration-500"
                style={{
                  transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}rem)`,
                  filter: i === active ? 'none' : 'brightness(0.55) saturate(0.7)',
                }}
              >
                <ProjectCover project={p} />
              </button>
            ))}
          </div>
          <p className="label pointer-events-none absolute inset-x-0 bottom-4 text-center text-muted">
            {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · keep scrolling
          </p>
        </div>
      </div>
    </div>
  );
}
