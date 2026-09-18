import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import './Cursor.css';

const HOVER_SELECTOR = 'a, button, .proj-card, .cert-card, .skill-row, .stat-card, .file-card, .edu-card, input, textarea';

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [label, setLabel] = useState('');

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const ringY = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });

  const lastTarget = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const el = e.target.closest(HOVER_SELECTOR);
      if (el !== lastTarget.current) {
        lastTarget.current = el;
        setHovering(!!el);
        if (el?.matches('a, button')) {
          setLabel(el.classList.contains('btn-solid') || el.classList.contains('btn-ghost') ? 'OPEN' : '');
        } else if (el?.matches('.proj-card')) {
          setLabel('VIEW');
        } else {
          setLabel('');
        }
      }
    };

    // Every click gets acknowledged: the ring snaps in and springs back.
    let clickTimer;
    const onDown = () => {
      setClicked(true);
      clearTimeout(clickTimer);
      clickTimer = setTimeout(() => setClicked(false), 240);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('pointerdown', onDown);
      clearTimeout(clickTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cur-dot" style={{ left: x, top: y }} />
      <motion.div
        className={`cur-ring ${hovering ? 'is-hover' : ''} ${clicked ? 'is-click' : ''}`}
        style={{ left: ringX, top: ringY }}
      >
        {label && <span className="cur-label">{label}</span>}
      </motion.div>
    </>
  );
}
