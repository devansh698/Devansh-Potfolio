import { useEffect, useRef } from 'react';
import { useCompanion } from './CompanionContext';
import { SCRIPT } from './script';
import { firstTime } from './memory';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'experience', 'certs', 'contact'];

const ZONE_MOODS = {
  home: 'curious',
  about: 'idle',
  skills: 'focused',
  projects: 'excited',
  experience: 'focused',
  certs: 'idle',
  contact: 'farewell',
};

/**
 * Which part of the world is the visitor in? Watches the viewport
 * center, tags <body data-zone> (the backdrop reacts to it), shifts the
 * companion's mood, and drops one-time contextual observations —
 * including "Back again?" when the visitor returns somewhere.
 */
export function useSectionSense() {
  const { say, setMood, introDone, visitorName } = useCompanion();
  const zoneRef = useRef(null);
  const visitedRef = useRef(new Set());
  const lineTimerRef = useRef(null);

  useEffect(() => {
    let raf = null;

    const zoneLine = (zone) => {
      // Say the zone's line only if the visitor actually settled there.
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
      lineTimerRef.current = setTimeout(() => {
        if (zoneRef.current !== zone) return;

        if (zone === 'contact') {
          // The proper goodbye — two beats, once.
          if (firstTime('farewell')) {
            setMood('farewell');
            say(SCRIPT.farewell.thanks(visitorName), { mood: 'farewell' });
            setTimeout(() => say(SCRIPT.farewell.build), 3400);
          }
          return;
        }

        const line = SCRIPT.zones[zone];
        if (line) say(line, { once: `zone:${zone}` });
      }, 1100);
    };

    const check = () => {
      raf = null;
      const centerY = window.innerHeight * 0.5;
      let current = zoneRef.current;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= centerY && r.bottom >= centerY) {
          current = id;
          break;
        }
      }
      if (!current || current === zoneRef.current) return;

      const previous = zoneRef.current;
      zoneRef.current = current;
      document.body.dataset.zone = current;

      if (!introDone) return;

      setMood(ZONE_MOODS[current] || 'idle', current === 'contact' ? undefined : 6000);

      // Returning to an already-explored zone (not just scrolling past home).
      if (previous && visitedRef.current.has(current) && current !== 'home') {
        say(SCRIPT.revisit, { once: 'revisit' });
      }
      visitedRef.current.add(current);

      zoneLine(current);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (lineTimerRef.current) clearTimeout(lineTimerRef.current);
    };
  }, [say, setMood, introDone, visitorName]);

  // Hero dwell: if they linger at the top without moving, one gentle cue.
  useEffect(() => {
    if (!introDone) return undefined;
    const t = setTimeout(() => {
      if (window.scrollY < 120) say(SCRIPT.zones.home, { once: 'zone:home' });
    }, 9000);
    return () => clearTimeout(t);
  }, [introDone, say]);
}

/**
 * Scroll velocity → the world responds. Writes --lean (companion tilts
 * into the motion) and data-flow="fast" (backdrop speeds up) on <body>.
 */
export function useScrollSense() {
  const { say, setMood, introDone, motionOk } = useCompanion();

  useEffect(() => {
    if (!motionOk) return undefined;
    let raf;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let lean = 0;
    let fastUntil = 0;

    const loop = (now) => {
      const y = window.scrollY;
      const dt = Math.max(now - lastT, 1);
      const vel = ((y - lastY) / dt) * 16.7; // px per frame-ish
      lastY = y;
      lastT = now;

      const targetLean = Math.max(-7, Math.min(7, vel * 0.18));
      lean += (targetLean - lean) * 0.12;
      document.body.style.setProperty('--lean', lean.toFixed(2));

      const speed = Math.abs(vel);
      if (speed > 26) fastUntil = now + 450;
      const fast = now < fastUntil;
      if ((document.body.dataset.flow === 'fast') !== fast) {
        if (fast) document.body.dataset.flow = 'fast';
        else delete document.body.dataset.flow;
      }

      if (introDone && speed > 90) {
        say(SCRIPT.fastScroll, { once: 'fast-scroll' });
        setMood('excited', 1600);
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.removeProperty('--lean');
      delete document.body.dataset.flow;
    };
  }, [say, setMood, introDone, motionOk]);
}

/**
 * Attention: if nothing happens for a while the companion gets pensive
 * and — once, ever — offers a nudge. Never a popup, never repeated.
 */
export function useIdleSense() {
  const { say, setMood, introDone } = useCompanion();

  useEffect(() => {
    if (!introDone) return undefined;
    let timer;

    const goIdle = () => {
      document.body.dataset.idle = '1';
      setMood('thinking');
      say(SCRIPT.idleNudge, { once: 'idle-nudge', mood: 'thinking' });
    };

    const reset = () => {
      if (document.body.dataset.idle) {
        delete document.body.dataset.idle;
        setMood('idle');
      }
      clearTimeout(timer);
      timer = setTimeout(goIdle, 32000);
    };

    const events = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((ev) => window.addEventListener(ev, reset, { passive: true }));
    reset();

    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
      delete document.body.dataset.idle;
    };
  }, [introDone, say, setMood]);
}
