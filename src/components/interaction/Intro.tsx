'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCompanion } from '@/components/providers/CompanionProvider';
import { SCRIPT } from '@/lib/interaction/script';
import { initTone, playTone } from '@/lib/interaction/tone';
import { remember } from '@/lib/interaction/memory';
import BotFace from './BotFace';

const EASE = [0.16, 1, 0.3, 1] as const;
type Stage = 'dormant' | 'wake' | 'lines' | 'name' | 'route';

/**
 * First contact: dormant → (cursor / tap / key) wake → staged lines → Enter →
 * optional name → optional route → bot flies to its dock.
 * Skippable at every moment, shown once per session.
 */
export default function Intro() {
  const { isPreloaded, isIntroDone, isClient } = useCompanion();
  if (!isClient || !isPreloaded || isIntroDone) return null;
  return <IntroOverlay />;
}

function IntroOverlay() {
  const { finishIntro, setVisitorName, glideTo, say, setMood } = useCompanion();
  const [isMotionOk] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [isPointerFine] = useState(() => window.matchMedia('(pointer: fine)').matches);
  const [stage, setStage] = useState<Stage>(isMotionOk ? 'dormant' : 'lines');
  const [lineCount, setLineCount] = useState(isMotionOk ? 0 : SCRIPT.intro.lines.length);
  const [isHintVisible, setHintVisible] = useState(false);
  const [name, setName] = useState('');
  const [echo, setEcho] = useState('');
  const [isLeaving, setLeaving] = useState(false);
  const overlay = useRef<HTMLDivElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const hasExited = useRef(false);

  const after = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }, []);

  useEffect(() => {
    overlay.current?.focus();
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  // Exit steps use bare timeouts: this component unmounts as soon as finishIntro lands.
  const exit = useCallback(
    (target?: string, followUp?: string) => {
      if (hasExited.current) return;
      hasExited.current = true;
      setLeaving(true);
      window.setTimeout(() => {
        finishIntro();
        setMood('curious', 4000);
        if (target) {
          window.setTimeout(() => glideTo(target, 1.9), 650);
          if (followUp) window.setTimeout(() => say(followUp), 2600);
        }
      }, isMotionOk ? 650 : 60);
    },
    [finishIntro, glideTo, isMotionOk, say, setMood],
  );

  useEffect(() => {
    if (stage !== 'dormant') return;
    const hint = setTimeout(() => setHintVisible(true), 3600);
    let travelled = 0;
    let last: { x: number; y: number } | null = null;
    const wake = () => {
      setHintVisible(false);
      setStage('wake');
    };
    const onMove = (e: PointerEvent) => {
      if (last) travelled += Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (travelled > 60) wake();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);
    return () => {
      clearTimeout(hint);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
  }, [stage]);

  useEffect(() => {
    if (stage === 'wake') after(900, () => setStage('lines'));
  }, [stage, after]);

  useEffect(() => {
    if (stage !== 'lines' || lineCount >= SCRIPT.intro.lines.length) return;
    after(lineCount === 0 ? 300 : 1150, () => setLineCount((c) => c + 1));
  }, [stage, lineCount, after]);

  // Spotlight + gaze follow the pointer.
  useEffect(() => {
    if (!isMotionOk) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = overlay.current;
        if (!el) return;
        el.style.setProperty('--ix', `${e.clientX}px`);
        el.style.setProperty('--iy', `${e.clientY}px`);
        const dx = e.clientX - window.innerWidth / 2;
        const dy = e.clientY - window.innerHeight / 2;
        const d = Math.hypot(dx, dy) || 1;
        el.style.setProperty('--look-x', ((dx / d) * 5).toFixed(2));
        el.style.setProperty('--look-y', ((dy / d) * 5).toFixed(2));
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [isMotionOk]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && exit();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exit]);

  const onEnter = () => {
    initTone(); // first real gesture — audio unlocks here
    playTone('open');
    setStage('name');
  };

  const onName = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const clean = name.replace(/[<>]/g, '').trim().slice(0, 24);
    if (clean) {
      setVisitorName(clean);
      setEcho(SCRIPT.intro.nameHello(clean));
      playTone('discover');
    } else {
      setEcho(SCRIPT.intro.nameSkipped);
    }
    after(1300, () => setStage('route'));
  };

  const onNameSkip = () => {
    setEcho(SCRIPT.intro.nameSkipped);
    playTone('tap');
    after(1000, () => setStage('route'));
  };

  const isAsleep = stage === 'dormant';
  const hasAllLines = lineCount >= SCRIPT.intro.lines.length;

  return (
    <motion.div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      tabIndex={-1}
      className="fixed inset-0 z-[95] flex items-center justify-center overflow-hidden bg-bg outline-none"
      animate={{ opacity: isLeaving ? 0 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ pointerEvents: isLeaving ? 'none' : 'auto' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isAsleep ? 0.35 : 1,
          background:
            'radial-gradient(600px circle at var(--ix, 50%) var(--iy, 50%), color-mix(in srgb, var(--accent) 14%, transparent), transparent 65%)',
        }}
      />
      <span className="label absolute left-5 top-5 text-muted">{`// visitor session — ${new Date().getFullYear()}`}</span>
      <button
        type="button"
        onClick={() => exit()}
        className="label absolute right-5 top-5 border border-line px-4 py-2 text-muted transition-colors hover:bg-fg hover:text-bg"
      >
        {SCRIPT.intro.skip} →
      </button>

      <div className="relative flex w-full max-w-xl flex-col items-center gap-8 px-6 text-center">
        <motion.div
          animate={isLeaving && isMotionOk ? { x: '40vw', y: '42vh', scale: 0.6, opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={isLeaving ? { duration: 0.65, ease: [0.5, 0, 0.75, 0.4] } : { type: 'spring', stiffness: 200, damping: 20 }}
        >
          <BotFace mood={isAsleep ? 'idle' : stage === 'route' ? 'excited' : 'curious'} size={88} isAsleep={isAsleep} />
        </motion.div>

        <AnimatePresence>
          {isHintVisible && isAsleep && (
            <motion.p className="label text-muted" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isPointerFine ? SCRIPT.intro.hintCursor : SCRIPT.intro.hintTouch}
            </motion.p>
          )}
        </AnimatePresence>

        {(stage === 'lines' || stage === 'wake') && (
          <div aria-live="polite" className="flex flex-col items-center gap-2">
            {SCRIPT.intro.lines.slice(0, lineCount).map((line, i) => (
              <motion.p
                key={line}
                className={`text-[clamp(1.5rem,4vw,2.6rem)] font-semibold leading-tight tracking-tight ${i === 2 ? 'text-accent' : ''}`}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {line}
              </motion.p>
            ))}
            {hasAllLines && (
              <motion.button
                type="button"
                onClick={onEnter}
                autoFocus
                data-cursor="Enter"
                className="display mt-6 bg-accent px-10 py-4 text-lg font-bold uppercase text-on-accent transition-transform hover:scale-105"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              >
                {SCRIPT.intro.enter} ↳
              </motion.button>
            )}
          </div>
        )}

        {stage === 'name' && (
          <motion.div className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            {echo ? (
              <p className="text-2xl font-semibold">{echo}</p>
            ) : (
              <>
                <p className="mb-6 text-2xl font-semibold">{SCRIPT.intro.nameAsk}</p>
                <form onSubmit={onName} className="flex flex-col gap-4">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={24}
                    autoFocus
                    aria-label={SCRIPT.intro.nameAsk}
                    placeholder={SCRIPT.intro.namePlaceholder}
                    className="w-full border-b-2 border-line bg-transparent py-3 text-center text-3xl text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none focus-visible:outline-none"
                  />
                  <div className="flex justify-center gap-3">
                    <button type="submit" className="bg-accent px-6 py-3 font-semibold text-on-accent">
                      {SCRIPT.intro.nameGo}
                    </button>
                    <button type="button" onClick={onNameSkip} className="border border-line px-6 py-3">
                      {SCRIPT.intro.nameSkip}
                    </button>
                  </div>
                </form>
                <p className="label mt-5 text-muted">{SCRIPT.intro.privacy}</p>
              </>
            )}
          </motion.div>
        )}

        {stage === 'route' && (
          <motion.div className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
            <p className="mb-6 text-2xl font-semibold">{SCRIPT.intro.routeAsk}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {SCRIPT.intro.routes.map((r, i) => (
                <motion.button
                  key={r.id}
                  type="button"
                  autoFocus={i === 0}
                  data-cursor="Go"
                  onClick={() => {
                    remember('route', r.id);
                    playTone('open');
                    exit(r.target, SCRIPT.routeFollowUp[r.id]);
                  }}
                  className="group flex flex-col items-start gap-1 border border-line bg-surface p-4 text-left transition-colors hover:border-accent hover:bg-accent hover:text-on-accent"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: EASE }}
                >
                  <span className="text-base font-bold uppercase tracking-wide">{r.label}</span>
                  <span className="text-sm opacity-70">{r.desc} ↗</span>
                </motion.button>
              ))}
            </div>
            <button type="button" onClick={() => exit()} className="label mt-6 text-muted underline-offset-4 hover:text-fg hover:underline">
              {SCRIPT.intro.wander} →
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
