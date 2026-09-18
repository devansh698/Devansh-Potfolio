import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanion } from './CompanionContext';
import { projectStories } from '../data';
import { SCRIPT } from './script';
import { playTone } from './tone';
import './ProjectStory.css';

const EASE = [0.16, 1, 0.3, 1];
const STAGES = ['PROBLEM', 'THINK', 'BUILD', 'RESULT'];

/**
 * The "project world": instead of a wall of text, the case study is
 * something the visitor walks through — a broken system (PROBLEM), parts
 * they activate themselves (THINK), a boot sequence (BUILD), and the
 * working thing (RESULT). Every stage is skippable via the stepper.
 */
export default function ProjectStory() {
  const companion = useCompanion();
  const p = companion.storyProject;
  const story = p ? projectStories[p.id] : null;

  return (
    <AnimatePresence>
      {p && story && <StoryDialog key={p.id} p={p} story={story} companion={companion} />}
    </AnimatePresence>
  );
}

function StoryDialog({ p, story, companion }) {
  const { setStoryProject, lockScroll, say, setMood, celebrate } = companion;

  const [stage, setStage] = useState(0);
  const [litChips, setLitChips] = useState(() => new Set());
  const [logCount, setLogCount] = useState(0);
  const panelRef = useRef(null);

  const close = useCallback(() => {
    playTone('close');
    setMood('idle');
    setStoryProject(null);
  }, [setMood, setStoryProject]);

  // Open choreography + cleanup on close (unmount).
  useEffect(() => {
    const returnFocus = document.activeElement;
    lockScroll(true);
    setMood('focused');
    say(SCRIPT.storyOpen, { once: `story:${p.id}` });
    panelRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      if (returnFocus?.focus) returnFocus.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BUILD stage: boot log types itself out line by line.
  useEffect(() => {
    if (stage !== 2 || logCount >= story.build.length) return undefined;
    const t = setTimeout(() => {
      setLogCount((c) => c + 1);
      playTone('hover');
    }, logCount === 0 ? 400 : 700);
    return () => clearTimeout(t);
  }, [story, stage, logCount]);

  const chips = p.tech;
  const allLit = litChips.size >= chips.length;
  const bootDone = logCount >= story.build.length;

  const lightChip = (chip) => {
    if (litChips.has(chip)) return;
    const next = new Set(litChips);
    next.add(chip);
    setLitChips(next);
    playTone('tap');
    if (next.size >= chips.length) {
      playTone('discover');
      setMood('excited', 2000);
    }
  };

  const advance = () => {
    if (stage === STAGES.length - 1) {
      close();
      return;
    }
    playTone('open');
    setStage((s) => s + 1);
  };

  return (
    <motion.div
      className="story-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <motion.div
        ref={panelRef}
        className="story-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${p.title} — case study`}
        tabIndex={-1}
        data-lenis-prevent
        initial={{ scale: 0.9, y: 44, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <header className="story-head">
          <div className="story-head-meta">
            <span className="story-code">{p.code}</span>
            <span className="story-cat">{p.cat}</span>
            <span className="story-period">{p.period}</span>
          </div>
          <button type="button" className="story-close" onClick={close} aria-label="Close case study">✕</button>
        </header>

        <h3 className="story-title">{p.title}</h3>
        <p className="story-sub">{p.sub}</p>

        <nav className="story-steps" aria-label="Case study stages">
          {STAGES.map((s, i) => (
            <button
              key={s}
              type="button"
              className={`story-step ${i === stage ? 'is-current' : ''} ${i < stage ? 'is-done' : ''}`}
              onClick={() => setStage(i)}
            >
              <span className="story-step-n">{String(i + 1).padStart(2, '0')}</span>
              {s}
            </button>
          ))}
        </nav>

        <div className="story-stage-wrap">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              className="story-stage"
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.32, ease: EASE }}
            >
              {stage === 0 && (
                <>
                  <p className="story-text">{story.problem}</p>
                  <div className="story-visual story-broken" aria-hidden="true">
                    {chips.map((c, i) => (
                      <span key={c} className="story-chip is-broken" style={{ '--i': i }}>{c}</span>
                    ))}
                    <span className="story-broken-label">system: not yet</span>
                  </div>
                </>
              )}

              {stage === 1 && (
                <>
                  <p className="story-text">{story.think}</p>
                  <div className="story-visual">
                    <p className="story-hint-line">
                      {allLit ? 'All components online.' : 'Tap each component to bring it online →'}
                    </p>
                    <div className="story-chip-row">
                      {chips.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`story-chip is-clickable ${litChips.has(c) ? 'is-lit' : ''}`}
                          onClick={() => lightChip(c)}
                          aria-pressed={litChips.has(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {stage === 2 && (
                <div className="story-console" role="log">
                  {story.build.slice(0, logCount).map((line) => (
                    <p key={line} className="story-log">
                      <span className="story-log-prompt">▸</span> {line.replace(' … ok', '')}
                      <span className="story-log-ok"> … ok</span>
                    </p>
                  ))}
                  {!bootDone && <p className="story-log"><span className="bub-caret">▌</span></p>}
                  {bootDone && <p className="story-log story-log-online">● SYSTEM ONLINE</p>}
                </div>
              )}

              {stage === 3 && (
                <>
                  <p className="story-text">{story.result}</p>
                  <div className="story-visual">
                    <div className="story-chip-row">
                      {chips.map((c) => (
                        <span key={c} className="story-chip is-lit">{c}</span>
                      ))}
                    </div>
                    <div className="story-result-actions">
                      {p.gh !== '#' ? (
                        <a
                          href={p.gh}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-solid"
                          onClick={() => celebrate('discover')}
                        >
                          View Code ↗
                        </a>
                      ) : (
                        <span className="story-wip">In development — code drops soon.</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <footer className="story-foot">
          <span className="story-foot-hint">{stage === 1 && !allLit ? 'or skip ahead —' : ''}</span>
          <button type="button" className="story-next" onClick={advance}>
            {stage === STAGES.length - 1 ? 'CLOSE' : `NEXT: ${STAGES[stage + 1]}`} →
          </button>
        </footer>
      </motion.div>
    </motion.div>
  );
}
