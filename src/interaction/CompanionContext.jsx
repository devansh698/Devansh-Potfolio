import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { recall, remember, firstTime } from './memory';
import { initTone, playTone, setMuted } from './tone';
import { SCRIPT } from './script';

/**
 * The companion's brain: a tiny state machine (mood) plus a throttled,
 * one-message-at-a-time speech queue. Everything user-facing routes
 * through here so the site "talks" sparingly and never overlaps itself.
 */
export const MOODS = ['idle', 'curious', 'excited', 'focused', 'thinking', 'success', 'discovery', 'farewell'];

const CompanionCtx = createContext(null);

export function CompanionProvider({ lenisRef, children }) {
  const [mood, setMoodState] = useState('curious');
  const [bubble, setBubble] = useState(null); // { id, text }
  const [visitorName, setVisitorNameState] = useState(() => recall('visitor-name') || '');
  const [introDone, setIntroDone] = useState(() => !!recall('intro-done'));
  const [soundOn, setSoundOn] = useState(() => recall('sound') !== 'off');
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [tldrOpen, setTldrOpen] = useState(false);
  const [storyProject, setStoryProject] = useState(null); // project object or null

  const queueRef = useRef([]);
  const speakingRef = useRef(false);
  const timersRef = useRef(new Set());
  const moodTimerRef = useRef(null);
  const pokeIdxRef = useRef(0);

  const pointerFine = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches,
    []
  );
  const motionOk = useMemo(
    () => typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    setMuted(!soundOn);
  }, [soundOn]);

  // Clear pending timers on unmount (also keeps StrictMode dev remounts clean).
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
      timers.clear();
      if (moodTimerRef.current) clearTimeout(moodTimerRef.current);
      queueRef.current = [];
      speakingRef.current = false;
    };
  }, []);

  const wait = useCallback((fn, ms) => {
    const t = setTimeout(() => {
      timersRef.current.delete(t);
      fn();
    }, ms);
    timersRef.current.add(t);
    return t;
  }, []);

  const setMood = useCallback((next, revertMs) => {
    if (moodTimerRef.current) {
      clearTimeout(moodTimerRef.current);
      moodTimerRef.current = null;
    }
    setMoodState(next);
    if (revertMs) {
      moodTimerRef.current = setTimeout(() => setMoodState('idle'), revertMs);
    }
  }, []);

  const pump = useCallback(() => {
    if (speakingRef.current) return;
    const next = queueRef.current.shift();
    if (!next) return;
    speakingRef.current = true;
    setBubble(next);
    if (next.mood) setMood(next.mood, next.hold + 1200);
    // Reading time scales with length; capped so nothing lingers.
    wait(() => {
      setBubble((b) => (b && b.id === next.id ? null : b));
      wait(() => {
        speakingRef.current = false;
        pump();
      }, 450);
    }, next.hold);
  }, [setMood, wait]);

  /**
   * say(text, { once, mood, hold })
   * `once` — a session key: the line fires a single time, ever, this session.
   * Queue is capped so the site can never chatter.
   */
  const say = useCallback(
    (text, { once, mood: lineMood, hold } = {}) => {
      if (!text) return;
      if (once && !firstTime(`say:${once}`)) return;
      if (queueRef.current.length >= 2) return; // never build up a monologue
      queueRef.current.push({
        id: `${Date.now()}-${Math.random()}`,
        text,
        mood: lineMood,
        hold: hold ?? Math.min(7000, Math.max(2800, 2400 + text.length * 34)),
      });
      pump();
    },
    [pump]
  );

  const hush = useCallback(() => {
    queueRef.current = [];
    setBubble(null);
  }, []);

  const celebrate = useCallback(
    (kind = 'discover') => {
      setMood(kind === 'success' ? 'success' : 'discovery', 2600);
      playTone(kind === 'success' ? 'success' : 'discover');
    },
    [setMood]
  );

  const poke = useCallback(() => {
    const lines = SCRIPT.pokes;
    const line = lines[pokeIdxRef.current % lines.length];
    pokeIdxRef.current += 1;
    setMood('excited', 1800);
    playTone('tap');
    say(line);
  }, [say, setMood]);

  const setVisitorName = useCallback((raw) => {
    const clean = String(raw || '').replace(/[<>]/g, '').trim().slice(0, 24);
    setVisitorNameState(clean);
    if (clean) remember('visitor-name', clean);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      remember('sound', next ? 'on' : 'off');
      if (next) {
        initTone();
        setMuted(false);
        playTone('tap');
      }
      return next;
    });
  }, []);

  const finishIntro = useCallback(() => {
    remember('intro-done');
    setIntroDone(true);
  }, []);

  const lockScroll = useCallback(
    (lock) => {
      // The html class is the reliable half (Lenis may not exist yet on
      // first paint — child effects run before App's Lenis effect).
      document.documentElement.classList.toggle('dh-locked', lock);
      const lenis = lenisRef?.current;
      if (!lenis) return;
      if (lock) lenis.stop();
      else lenis.start();
    },
    [lenisRef]
  );

  // The "camera": deliberate glide instead of a teleport.
  const glideTo = useCallback(
    (target, { duration = 1.7 } = {}) => {
      const lenis = lenisRef?.current;
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      if (lenis) {
        lenis.scrollTo(el, { offset: -16, duration, easing: (t) => 1 - Math.pow(1 - t, 4) });
      } else {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [lenisRef]
  );

  const value = useMemo(
    () => ({
      mood, setMood,
      bubble, say, hush,
      visitorName, setVisitorName,
      soundOn, toggleSound,
      introDone, finishIntro,
      terminalOpen, setTerminalOpen,
      tldrOpen, setTldrOpen,
      storyProject, setStoryProject,
      celebrate, poke,
      lockScroll, glideTo,
      pointerFine, motionOk,
    }),
    [
      mood, setMood, bubble, say, hush, visitorName, setVisitorName, soundOn, toggleSound,
      introDone, finishIntro, terminalOpen, tldrOpen, storyProject,
      celebrate, poke, lockScroll, glideTo, pointerFine, motionOk,
    ]
  );

  return <CompanionCtx.Provider value={value}>{children}</CompanionCtx.Provider>;
}

export function useCompanion() {
  const ctx = useContext(CompanionCtx);
  if (!ctx) throw new Error('useCompanion must be used inside <CompanionProvider>');
  return ctx;
}
