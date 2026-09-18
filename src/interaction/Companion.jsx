import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompanion } from './CompanionContext';
import BotFace from './BotFace';
import './Companion.css';

/** Typewriter reveal — matches the hero's typed line aesthetic. */
function TypeText({ text }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(0);
    if (!text) return undefined;
    const iv = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(iv);
          return c;
        }
        return c + 1;
      });
    }, 16);
    return () => clearInterval(iv);
  }, [text]);

  return (
    <>
      {text.slice(0, count)}
      {count < text.length && <span className="bub-caret">▌</span>}
    </>
  );
}

/**
 * The docked companion: bottom-right, watches the cursor, blinks,
 * leans with scroll (via --lean set on <body>), and speaks through a
 * single polite bubble. Clicking it pokes it.
 */
export default function Companion() {
  const { mood, bubble, poke, introDone, motionOk } = useCompanion();
  const rootRef = useRef(null);
  const [blink, setBlink] = useState(false);

  // Eye tracking: chases the cursor; drifts on its own when idle/touch.
  useEffect(() => {
    if (!introDone) return undefined;
    let raf;
    let tx = 0, ty = 0;   // target look offset
    let cx = 0, cy = 0;   // current (lerped)
    let lastMove = 0;
    let nextSaccade = performance.now() + 2200;

    const onMove = (e) => {
      const el = rootRef.current;
      if (!el) return;
      lastMove = performance.now();
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      tx = (dx / d) * 4.5;
      ty = (dy / d) * 4.5;
    };

    const loop = (now) => {
      // No cursor input for a while → occasional curious glances.
      if (now - lastMove > 2600 && now > nextSaccade) {
        const a = Math.random() * Math.PI * 2;
        const m = 2 + Math.random() * 2.5;
        tx = Math.cos(a) * m;
        ty = Math.sin(a) * m * 0.7;
        nextSaccade = now + 1800 + Math.random() * 2400;
      }
      cx += (tx - cx) * 0.14;
      cy += (ty - cy) * 0.14;
      const el = rootRef.current;
      if (el) {
        el.style.setProperty('--look-x', cx.toFixed(2));
        el.style.setProperty('--look-y', cy.toFixed(2));
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [introDone]);

  // Natural blinking on a randomized clock.
  useEffect(() => {
    if (!introDone) return undefined;
    let t1, t2;
    const schedule = () => {
      t1 = setTimeout(() => {
        setBlink(true);
        t2 = setTimeout(() => {
          setBlink(false);
          schedule();
        }, 140);
      }, 2800 + Math.random() * 3600);
    };
    schedule();
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [introDone]);

  if (!introDone) return null;

  return (
    <>
      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble.id}
            className="comp-bubble"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
          >
            <TypeText text={bubble.text} />
            <span className="comp-bubble-tail" aria-hidden="true" />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={rootRef}
        type="button"
        className={`companion ${blink ? 'is-blink' : ''}`}
        aria-label="Site companion — give it a poke"
        onClick={poke}
        initial={motionOk ? { scale: 0, y: 40 } : false}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 17, delay: 0.4 }}
      >
        <span className="comp-lean">
          <BotFace mood={mood} size={56} />
        </span>
      </motion.button>
    </>
  );
}
