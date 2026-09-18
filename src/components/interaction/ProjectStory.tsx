'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompanion } from '@/components/providers/CompanionProvider';
import Modal, { CloseButton } from '@/components/ui/Modal';
import { SCRIPT } from '@/lib/interaction/script';
import { playTone } from '@/lib/interaction/tone';
import { projects, type Project } from '@/lib/data';

const EASE = [0.16, 1, 0.3, 1] as const;
const STAGES = ['Problem', 'Think', 'Build', 'Result'] as const;

/**
 * Case study as something to walk through: a broken system (Problem), parts the
 * visitor powers on (Think), a boot log (Build) and the working thing (Result).
 */
export default function ProjectStory() {
  const { storyProject, setStoryProject } = useCompanion();
  return (
    <Modal isOpen={storyProject !== null} onClose={() => setStoryProject(null)} label={`${storyProject?.title ?? 'Project'} — case study`} className="max-w-3xl">
      {storyProject && <Story key={storyProject.id} project={storyProject} />}
    </Modal>
  );
}

function Story({ project }: { project: Project }) {
  const { setStoryProject, say, setMood, celebrate } = useCompanion();
  const [stage, setStage] = useState(0);
  const [litChips, setLitChips] = useState<Set<string>>(() => new Set());
  const [logCount, setLogCount] = useState(0);

  const index = projects.findIndex((p) => p.id === project.id);
  const isAllLit = litChips.size >= project.stack.length;
  const isBooted = logCount >= project.build.length;

  useEffect(() => {
    setMood('focused');
    say(SCRIPT.storyOpen, { once: 'story-open' });
  }, [say, setMood]);

  useEffect(() => {
    if (stage !== 2 || isBooted) return;
    const t = setTimeout(() => {
      setLogCount((c) => c + 1);
      playTone('type');
    }, logCount === 0 ? 350 : 650);
    return () => clearTimeout(t);
  }, [stage, logCount, isBooted]);

  const close = () => {
    setMood('idle');
    setStoryProject(null);
  };

  const light = (chip: string) => {
    if (litChips.has(chip)) return;
    const next = new Set(litChips).add(chip);
    setLitChips(next);
    playTone('tap');
    if (next.size >= project.stack.length) celebrate('discover');
  };

  const goTo = (i: number) => {
    playTone('open');
    setStage(i);
  };

  const sibling = (dir: 1 | -1) => {
    playTone('open');
    setStoryProject(projects[(index + dir + projects.length) % projects.length]);
  };

  return (
    <div className="flex flex-col">
      <header className="relative overflow-hidden px-6 pb-6 pt-5 sm:px-8" style={{ background: project.tone, color: '#111' }}>
        <div className="flex items-center justify-between">
          <span className="label">
            {project.code} · {project.category} · {project.period}
          </span>
          <span className="[&_button]:border-black/25 [&_button:hover]:bg-black [&_button:hover]:text-white">
            <CloseButton onClick={close} label="Close case study" />
          </span>
        </div>
        <h3 className="display mt-8 text-[clamp(2rem,6vw,3.8rem)] leading-[0.85]">{project.title}</h3>
        <p className="mt-2 font-medium">{project.kind}</p>
      </header>

      <nav aria-label="Case study stages" className="grid grid-cols-4 border-b border-line">
        {STAGES.map((s, i) => (
          <button
            key={s}
            type="button"
            onClick={() => goTo(i)}
            aria-current={i === stage ? 'step' : undefined}
            className={`relative flex flex-col items-start gap-0.5 px-3 py-3 text-left transition-colors sm:px-5 ${i === stage ? 'text-fg' : 'text-muted hover:text-fg'}`}
          >
            <span className="label">{String(i + 1).padStart(2, '0')}</span>
            <span className="text-sm font-semibold sm:text-base">{s}</span>
            {i === stage && <motion.span layoutId="story-step" className="absolute inset-x-0 bottom-0 h-0.5 bg-accent" />}
            {i < stage && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-accent/30" />}
          </button>
        ))}
      </nav>

      <div className="min-h-[18rem] px-6 py-7 sm:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {stage === 0 && (
              <>
                <p className="text-xl leading-relaxed">{project.problem}</p>
                <div className="mt-6 flex flex-wrap items-center gap-2" aria-hidden="true">
                  {project.stack.map((c, i) => (
                    <motion.span
                      key={c}
                      className="border border-dashed border-line px-3 py-1 text-sm text-muted"
                      animate={{ rotate: [0, i % 2 ? 4 : -4, 0], y: [0, 3, 0] }}
                      transition={{ duration: 1.6 + i * 0.2, repeat: Infinity }}
                    >
                      {c}
                    </motion.span>
                  ))}
                  <span className="label ml-2 text-accent-2">system: not yet</span>
                </div>
              </>
            )}

            {stage === 1 && (
              <>
                <p className="text-xl leading-relaxed">{project.think}</p>
                <p className="label mt-6 text-muted">{isAllLit ? 'All components online.' : 'Tap each component to bring it online →'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((c) => {
                    const isLit = litChips.has(c);
                    return (
                      <motion.button
                        key={c}
                        type="button"
                        onClick={() => light(c)}
                        aria-pressed={isLit}
                        whileTap={{ scale: 0.92 }}
                        data-cursor="Power"
                        className={`border px-4 py-2 text-sm font-semibold transition-colors ${
                          isLit ? 'border-accent bg-accent text-on-accent' : 'border-line hover:border-accent'
                        }`}
                      >
                        {isLit ? '● ' : '○ '}
                        {c}
                      </motion.button>
                    );
                  })}
                </div>
              </>
            )}

            {stage === 2 && (
              <div role="log" className="bg-bg p-5 font-mono text-sm">
                {project.build.slice(0, logCount).map((line) => (
                  <p key={line} className="py-0.5">
                    <span className="text-accent">▸</span> {line}
                    <span className="text-muted"> … </span>
                    <span className="text-accent">ok</span>
                  </p>
                ))}
                {isBooted ? <p className="mt-2 font-bold text-accent">● SYSTEM ONLINE</p> : <span className="caret text-accent">▌</span>}
              </div>
            )}

            {stage === 3 && (
              <>
                <p className="text-xl leading-relaxed">{project.result}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.stack.map((c) => (
                    <span key={c} className="bg-accent px-3 py-1 text-sm font-semibold text-on-accent">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  {project.repo ? (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => celebrate('discover')}
                      className="inline-flex bg-fg px-6 py-3 font-semibold text-bg transition-colors hover:bg-accent hover:text-on-accent"
                    >
                      View code ↗
                    </a>
                  ) : (
                    <span className="label text-muted">In development — code drops soon.</span>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <footer className="flex items-center justify-between gap-3 border-t border-line px-6 py-4 sm:px-8">
        <div className="flex gap-2">
          <button type="button" onClick={() => sibling(-1)} className="label border border-line px-3 py-2 hover:bg-fg hover:text-bg" aria-label="Previous project">
            ← Prev
          </button>
          <button type="button" onClick={() => sibling(1)} className="label border border-line px-3 py-2 hover:bg-fg hover:text-bg" aria-label="Next project">
            Next →
          </button>
        </div>
        <button
          type="button"
          onClick={() => (stage === STAGES.length - 1 ? close() : goTo(stage + 1))}
          className="bg-accent px-5 py-2.5 text-sm font-bold uppercase text-on-accent"
        >
          {stage === STAGES.length - 1 ? 'Close' : `Next: ${STAGES[stage + 1]}`} →
        </button>
      </footer>
    </div>
  );
}
