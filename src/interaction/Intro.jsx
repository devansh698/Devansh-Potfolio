import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanion } from './CompanionContext';
import { SCRIPT } from './script';
import { initTone, playTone } from './tone';
import { remember } from './memory';
import BotFace from './BotFace';
import './Intro.css';

const EASE = [0.16, 1, 0.3, 1];

/**
 * First contact. The site doesn't dump content — it notices the visitor.
 * dormant → (cursor moves / tap) wake → staged lines → ENTER →
 * optional name → optional route → the bot flies to its corner dock.
 * Fully skippable at every moment, shown once per session.
 */
export default function Intro() {
  const { finishIntro, lockScroll, setVisitorName, glideTo, say, setMood, pointerFine, motionOk } = useCompanion();

  const [stage, setStage] = useState(motionOk ? 'dormant' : 'lines');
  const [lineCount, setLineCount] = useState(motionOk ? 0 : SCRIPT.intro.lines.length);
  const [showHint, setShowHint] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameEcho, setNameEcho] = useState('');
  const [leaving, setLeaving] = useState(false);
  const [flight, setFlight] = useState(null); // {x, y} target for the corner dock

  const overlayRef = useRef(null);
  const timersRef = useRef(new Set());
  const exitedRef = useRef(false);

  const after = useCallback((ms, fn) => {
    const t = setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
  }, []);

  // Hold the page still while the overlay owns the screen.
  useEffect(() => {
    lockScroll(true);
    const timers = timersRef.current;
    return () => {
      lockScroll(false);
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [lockScroll]);

  useEffect(() => {
    overlayRef.current?.focus();
  }, []);

  /* ── The full exit: bot flies to its dock, overlay dissolves. ──
     Post-exit steps use bare timeouts (not the tracked set) because this
     component unmounts the moment finishIntro() lands — the glide and
     follow-up line must outlive it. The provider they call stays mounted. */
  const exit = useCallback(
    ({ target, followUp } = {}) => {
      if (exitedRef.current) return;
      exitedRef.current = true;

      if (motionOk) {
        // Fly the bot from screen center to where the dock lives.
        setFlight({
          x: window.innerWidth / 2 - 66,
          y: window.innerHeight / 2 - 70,
        });
      }
      setLeaving(true);

      window.setTimeout(() => {
        lockScroll(false);
        finishIntro();
        setMood('curious', 4000);
        if (target) {
          window.setTimeout(() => glideTo(target, { duration: 1.9 }), 650);
          if (followUp) window.setTimeout(() => say(followUp), 2600);
        }
      }, motionOk ? 620 : 60);
    },
    [finishIntro, glideTo, lockScroll, motionOk, say, setMood]
  );

  /* ── Dormant: wait for presence (cursor motion / tap / key). ── */
  useEffect(() => {
    if (stage !== 'dormant') return undefined;

    const hintTimer = setTimeout(() => setShowHint(true), 4200);
    let travelled = 0;
    let last = null;

    const wake = () => setStage('wake');
    const onMove = (e) => {
      if (last) travelled += Math.hypot(e.clientX - last.x, e.clientY - last.y);
      last = { x: e.clientX, y: e.clientY };
      if (travelled > 60) wake();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', wake);
    window.addEventListener('keydown', wake);
    return () => {
      clearTimeout(hintTimer);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', wake);
      window.removeEventListener('keydown', wake);
    };
  }, [stage]);

  /* ── Wake: the bot notices, the room lights up, then it speaks. ── */
  useEffect(() => {
    if (stage !== 'wake') return undefined;
    setShowHint(false);
    after(1000, () => setStage('lines'));
    return undefined;
  }, [stage, after]);

  /* ── Lines: three beats, then the door. ── */
  useEffect(() => {
    if (stage !== 'lines' || lineCount >= SCRIPT.intro.lines.length) return undefined;
    after(lineCount === 0 ? 350 : 1250, () => setLineCount((c) => c + 1));
    return undefined;
  }, [stage, lineCount, after]);

  /* ── Cursor-following light + the bot's gaze inside the overlay. ── */
  useEffect(() => {
    if (!motionOk) return undefined;
    let raf = null;
    const onMove = (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = overlayRef.current;
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
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [motionOk]);

  /* ── Escape always works. ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') exit();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exit]);

  const handleEnter = () => {
    initTone(); // first real gesture — audio unlocks here
    playTone('open');
    setMood('excited', 2000);
    setStage('name');
  };

  const handleName = (e) => {
    e.preventDefault();
    const clean = nameValue.replace(/[<>]/g, '').trim().slice(0, 24);
    if (clean) {
      setVisitorName(clean);
      setNameEcho(SCRIPT.intro.nameHello(clean));
      playTone('discover');
    } else {
      setNameEcho(SCRIPT.intro.nameSkipped);
    }
    after(1400, () => setStage('route'));
  };

  const handleNameSkip = () => {
    setNameEcho(SCRIPT.intro.nameSkipped);
    playTone('tap');
    after(1100, () => setStage('route'));
  };

  const handleRoute = (route) => {
    remember('route', route.id);
    playTone('open');
    exit({ target: route.target, followUp: SCRIPT.routeFollowUp[route.id] });
  };

  const allLines = lineCount >= SCRIPT.intro.lines.length;
  const asleep = stage === 'dormant';

  return (
    <motion.div
      ref={overlayRef}
      className={`intro ${asleep ? 'is-dormant' : 'is-awake'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome"
      tabIndex={-1}
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{ pointerEvents: leaving ? 'none' : 'auto' }}
    >
      <div className="intro-light" aria-hidden="true" />
      <div className="crop tl" /><div className="crop tr" /><div className="crop bl" /><div className="crop br" />

      <span className="intro-session" aria-hidden="true">{`// visitor session — ${new Date().getFullYear()}`}</span>

      <button type="button" className="intro-skip" onClick={() => exit()}>
        {SCRIPT.intro.skip} →
      </button>

      <div className="intro-center">
        <motion.div
          className="intro-bot"
          animate={flight ? { x: flight.x, y: flight.y, scale: 0.62, opacity: 0 } : { x: 0, y: 0, scale: 1, opacity: 1 }}
          transition={flight ? { duration: 0.62, ease: [0.5, 0, 0.75, 0.4] } : { type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className={asleep ? 'bot-asleep' : ''}>
            <BotFace mood={asleep ? 'idle' : stage === 'route' ? 'excited' : 'curious'} size={84} />
          </div>
        </motion.div>

        <AnimatePresence>
          {showHint && asleep && (
            <motion.p
              className="intro-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {pointerFine ? SCRIPT.intro.hintCursor : SCRIPT.intro.hintTouch}
            </motion.p>
          )}
        </AnimatePresence>

        {(stage === 'lines' || stage === 'wake') && (
          <div className="intro-lines" aria-live="polite">
            {SCRIPT.intro.lines.slice(0, lineCount).map((line, i) => (
              <motion.p
                key={line}
                className={`intro-line intro-line-${i}`}
                initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                {line}
              </motion.p>
            ))}

            {allLines && (
              <motion.button
                type="button"
                className="intro-enter"
                onClick={handleEnter}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                autoFocus
              >
                {SCRIPT.intro.enter}
                <span className="intro-enter-arrow">↳</span>
              </motion.button>
            )}
          </div>
        )}

        {stage === 'name' && (
          <motion.div
            className="intro-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {nameEcho ? (
              <p className="intro-echo">{nameEcho}</p>
            ) : (
              <>
                <p className="intro-ask">{SCRIPT.intro.nameAsk}</p>
                <form className="intro-name-form" onSubmit={handleName}>
                  <input
                    type="text"
                    className="intro-name-input"
                    placeholder={SCRIPT.intro.namePlaceholder}
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    maxLength={24}
                    autoFocus
                    aria-label={SCRIPT.intro.nameAsk}
                  />
                  <div className="intro-name-actions">
                    <button type="submit" className="intro-mini-btn solid">{SCRIPT.intro.nameGo}</button>
                    <button type="button" className="intro-mini-btn ghost" onClick={handleNameSkip}>
                      {SCRIPT.intro.nameSkip}
                    </button>
                  </div>
                </form>
                <p className="intro-privacy">stays in this tab · never stored · never sent</p>
              </>
            )}
          </motion.div>
        )}

        {stage === 'route' && (
          <motion.div
            className="intro-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <p className="intro-ask">{SCRIPT.intro.routeAsk}</p>
            <div className="intro-routes">
              {SCRIPT.intro.routes.map((r, i) => (
                <motion.button
                  key={r.id}
                  type="button"
                  className="intro-route"
                  onClick={() => handleRoute(r)}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.1 + i * 0.09, ease: EASE }}
                  autoFocus={i === 0}
                >
                  <span className="intro-route-label">{r.label}</span>
                  <span className="intro-route-desc">{r.desc} ↗</span>
                </motion.button>
              ))}
            </div>
            <button type="button" className="intro-wander" onClick={() => exit()}>
              {SCRIPT.intro.wander} →
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
