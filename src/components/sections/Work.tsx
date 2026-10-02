'use client';

import { useMemo, useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import { AnimatePresence, LayoutGroup, motion, useInView, useMotionValue, useSpring } from 'framer-motion';
import SectionHeading from '@/components/ui/SectionHeading';
import ProjectCover from '@/components/ui/ProjectCover';
import ProjectRing from '@/components/sections/ProjectRing';
import { REDUCED_MOTION, useMediaQuery } from '@/hooks/useMediaQuery';
import { useCompanion } from '@/components/providers/CompanionProvider';
import { SCRIPT } from '@/lib/interaction/script';
import { playTone } from '@/lib/interaction/tone';
import { spotlight } from '@/lib/spotlight';
import { projectFilters, projects, type Project, type ProjectFilter } from '@/lib/data';
import { projectPath } from '@/lib/site';

const EASE = [0.16, 1, 0.3, 1] as const;
type View = 'ring' | 'list' | 'grid';
const VIEW_LABEL: Record<View, string> = { ring: '◎ 3D', list: '☰ List', grid: '▦ Grid' };

/** Small outbound chip for a project's deployment; sits above stretched card buttons. */
function LiveLink({ project, className = '' }: { project: Project; className?: string }) {
  if (!project.live) return null;
  return (
    <a
      href={project.live}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${project.title} live site (opens in a new tab)`}
      data-cursor="Visit"
      className={`label z-10 items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 transition-colors hover:border-fg hover:bg-fg hover:text-bg ${className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#2bb673]" />
      Live ↗
    </a>
  );
}

function TiltCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const rx = useSpring(0, { stiffness: 200, damping: 18 });
  const ry = useSpring(0, { stiffness: 200, damping: 18 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    spotlight(e);
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    rx.set(((e.clientY - r.top) / r.height - 0.5) * -10);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className="spotlight group relative flex h-full flex-col overflow-hidden border border-line bg-surface text-left transition-colors hover:border-fg/40"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <div className="h-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
          <ProjectCover project={project} isCompact />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-xl font-bold">
            {/* Stretched button: the whole card opens the case study, the live chip stays its own link. */}
            <button type="button" onClick={onOpen} data-cursor="Open" className="text-left after:absolute after:inset-0 after:content-['']">
              {project.title}
            </button>
          </h3>
          <span className="label text-muted">{project.category}</span>
        </div>
        <p className="text-sm leading-relaxed text-muted">{project.desc}</p>
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((t) => (
              <span key={t} className="border border-line px-2.5 py-0.5 text-xs">
                {t}
              </span>
            ))}
          </div>
          <LiveLink project={project} className="relative inline-flex" />
        </div>
      </div>
    </motion.article>
  );
}

export default function Work() {
  const root = useRef<HTMLElement>(null);
  const { setStoryProject, say, setMood } = useCompanion();
  const [filter, setFilter] = useState<ProjectFilter>('All');
  const [chosenView, setView] = useState<View>('ring');
  // The ring is scroll-driven motion, so reduced-motion visitors get the list instead.
  const isReducedMotion = useMediaQuery(REDUCED_MOTION);
  const view: View = isReducedMotion && chosenView === 'ring' ? 'list' : chosenView;
  const [hovered, setHovered] = useState<Project | null>(null);
  const interest = useRef<Record<string, number>>({});
  // Scrolling away doesn't fire pointerleave, so tie the preview to visibility too.
  const isInView = useInView(root, { amount: 0.1 });

  const visible = useMemo(() => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)), [filter]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 180, damping: 22, mass: 0.6 });

  const open = (p: Project) => {
    playTone('open');
    setStoryProject(p);
  };

  const noticeInterest = (p: Project) => {
    setHovered(p);
    interest.current[p.id] = (interest.current[p.id] ?? 0) + 1;
    if (interest.current[p.id] === 3) {
      say(SCRIPT.projectInterest, { once: 'project-interest' });
      setMood('curious', 2400);
    }
  };

  const showPreview = view === 'list' && hovered !== null && isInView;

  return (
    <section
      id="work"
      ref={root}
      aria-labelledby="work-title"
      onPointerMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      className="gutter relative py-[clamp(6rem,12vw,10rem)]"
    >
      <SectionHeading index="03" eyebrow="Selected work" title="Selected" accent="work" meta={`${projects.length} plates`} id="work-title" />

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <LayoutGroup id="work-filter">
          <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-2">
            {projectFilters.map((f) => {
              const isActive = f === filter;
              const count = f === 'All' ? projects.length : projects.filter((p) => p.category === f).length;
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
                  className="chip relative isolate"
                >
                  {isActive && <motion.span layoutId="work-filter-pill" className="absolute inset-0 -z-10 rounded-full bg-fg" />}
                  {f} <span className="font-mono text-[0.7rem] opacity-60">{String(count).padStart(2, '0')}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div role="radiogroup" aria-label="Layout" className="flex rounded-full border border-line p-1">
          {(isReducedMotion ? (['list', 'grid'] as const) : (['ring', 'list', 'grid'] as const)).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => {
                playTone('tap');
                setView(v);
              }}
              className={`label rounded-full px-3.5 py-1.5 transition-colors ${view === v ? 'bg-fg text-bg' : 'text-muted hover:text-fg'}`}
            >
              {VIEW_LABEL[v]}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {view === 'ring' ? (
          <motion.div key="ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ProjectRing key={filter} projects={visible} onOpen={open} />
          </motion.div>
        ) : view === 'list' ? (
          <motion.ul
            key="list"
            className="border-t border-line"
            onPointerLeave={() => setHovered(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((project) => {
                const isDimmed = hovered !== null && hovered.id !== project.id;
                return (
                  <motion.li key={project.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45, ease: EASE }} className="relative border-b border-line">
                    <button
                      type="button"
                      onClick={() => open(project)}
                      onPointerEnter={() => noticeInterest(project)}
                      onFocus={() => setHovered(project)}
                      data-cursor="Explore"
                      className="group grid w-full grid-cols-[3.5rem_1fr_auto] items-center gap-4 py-6 text-left transition-opacity duration-500 md:grid-cols-[5rem_1.8fr_1fr_5rem_6rem_3rem] md:py-8"
                      style={{ opacity: isDimmed ? 0.35 : 1 }}
                    >
                      <span className="label text-muted">{project.code}</span>
                      <span className="flex flex-col">
                        <span className="display text-[clamp(1.4rem,3.2vw,2.9rem)] font-bold uppercase leading-none transition-[transform,color] duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent">
                          {project.title}
                        </span>
                        <span className="mt-2 text-sm text-muted md:hidden">{project.kind}</span>
                      </span>
                      <span className="hidden text-muted md:block">{project.kind}</span>
                      <span className="label hidden text-muted md:block">{project.year}</span>
                      {/* Placeholder cell: the live link is a sibling (no links inside buttons) laid over this column. */}
                      <span aria-hidden="true" className="hidden md:block" />
                      <span aria-hidden="true" className="grid size-10 place-items-center border border-line text-lg transition-all duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent">
                        ↗
                      </span>
                    </button>
                    <LiveLink project={project} className="absolute right-[4.5rem] top-1/2 hidden -translate-y-1/2 md:inline-flex" />
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div key="grid" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((project, i) => (
                <motion.div key={project.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}>
                  <TiltCard project={project} onOpen={() => open(project)} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plain links to each case-study page: the interactive views open a modal,
          so this index is what gives crawlers (and no-JS readers) a path to every project. */}
      <nav aria-label="Project case studies" className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-t border-line pt-5">
        <span className="label text-muted">Case files</span>
        {projects.map((p) => (
          <Link key={p.id} href={projectPath(p)} className="label text-muted underline-offset-4 hover:text-accent hover:underline">
            {p.title}
          </Link>
        ))}
      </nav>

      {/* Cursor-follow preview, pointer devices only. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-30 hidden aspect-[4/3] w-[20rem] overflow-hidden shadow-2xl [@media(hover:hover)]:md:block"
        style={{ x: sx, y: sy, translateX: '30%', translateY: '-50%' }}
        animate={{ scale: showPreview ? 1 : 0, rotate: showPreview ? -4 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {hovered && (
            <motion.div
              key={hovered.id}
              className="absolute inset-0"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              animate={{ clipPath: 'inset(0% 0 0 0)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <ProjectCover project={hovered} isCompact isLiveEnabled={false} sizes="20rem" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
