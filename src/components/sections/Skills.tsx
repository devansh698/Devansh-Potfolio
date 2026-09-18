'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useInView } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import TechSphere from '@/components/sections/TechSphere';
import { playTone } from '@/lib/interaction/tone';
import { projects, skillGroups, skills, ticker, type SkillGroup } from '@/lib/data';

const SPHERE_WORDS = [...ticker, 'TypeScript', 'Vue', 'Inertia', 'Tailwind', 'Python', 'Docker', 'Git', 'PHP', 'LLMs', 'SQL', 'Express', 'Three.js'];

type Filter = 'All' | SkillGroup;
const FILTERS: Filter[] = ['All', ...skillGroups];

// Maps a skill row to the project stack names that prove it.
const PROOF_KEYS: Record<string, string[]> = {
  'React.js': ['React'],
  'Node.js / Express': ['Node.js', 'Express'],
  'MongoDB / MySQL': ['MongoDB'],
  'REST APIs / JWT': ['JWT', 'Express'],
  'JavaScript / SQL': ['JavaScript', 'React'],
};

export default function Skills() {
  const [filter, setFilter] = useState<Filter>('All');
  const [hovered, setHovered] = useState<string | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const isInView = useInView(list, { once: true, amount: 0.2 });

  const visible = useMemo(() => (filter === 'All' ? skills : skills.filter((s) => s.group === filter)), [filter]);
  const avg = Math.round(visible.reduce((sum, s) => sum + s.level, 0) / visible.length);

  const proofFor = (name: string) => {
    const keys = PROOF_KEYS[name];
    if (!keys) return [];
    return projects.filter((p) => p.stack.some((t) => keys.includes(t))).map((p) => p.title);
  };

  return (
    <section id="skills" aria-labelledby="skills-title" className="gutter relative bg-surface py-[clamp(6rem,12vw,10rem)]">
      <SectionHeading
        index="02"
        eyebrow="Toolkit"
        title="The"
        accent="toolkit"
        meta={`${skills.length} instruments`}
        id="skills-title"
        aside={
          <p className="text-right">
            <span className="display block text-5xl tabular-nums text-accent">{avg}%</span>
            <span className="label text-muted">avg · {filter}</span>
          </p>
        }
      />

      <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:sticky lg:top-24 lg:col-span-5 lg:self-start">
        <TechSphere words={SPHERE_WORDS} />
        <p className="label mt-2 text-center text-muted">Drag to spin · scroll to kick it</p>
      </div>
      <div className="lg:col-span-7">
      <LayoutGroup>
        <div role="tablist" aria-label="Filter skills" className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const isActive = f === filter;
            return (
              <button
                key={f}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  playTone('tap');
                  setFilter(f);
                }}
                className={`relative isolate border border-line px-4 py-2 text-sm font-semibold transition-colors ${isActive ? 'text-on-accent' : 'hover:border-accent'}`}
              >
                {isActive && <motion.span layoutId="skill-filter" className="absolute inset-0 -z-10 bg-accent" />}
                {f}
              </button>
            );
          })}
        </div>

        <ul ref={list} className="border-t border-line" onPointerLeave={() => setHovered(null)}>
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((s, i) => {
              const isDim = hovered !== null && hovered !== s.name;
              const proof = hovered === s.name ? proofFor(s.name) : [];
              return (
                <motion.li
                  layout
                  key={s.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isDim ? 0.4 : 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  onPointerEnter={() => setHovered(s.name)}
                  className="group grid grid-cols-[2rem_1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line py-4 md:grid-cols-[2.5rem_14rem_1fr_4rem]"
                >
                  <span className="label text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-semibold md:text-lg">
                    {s.name}
                    <span className="label ml-2 hidden text-muted sm:inline">{s.group}</span>
                  </span>
                  <span className="order-last col-span-3 h-2 overflow-hidden bg-bg md:order-none md:col-span-1">
                    <motion.span
                      className="block h-full origin-left bg-accent"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isInView ? s.level / 100 : 0 }}
                      transition={{ duration: 1.2, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className="display text-right text-xl tabular-nums group-hover:text-accent">{s.level}%</span>
                  {proof.length > 0 && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="label col-span-3 text-muted md:col-start-2">
                      Used in → {proof.slice(0, 3).join(' · ')}
                    </motion.span>
                  )}
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </LayoutGroup>
      </div>
      </div>
    </section>
  );
}
