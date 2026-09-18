'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import { useLenis } from 'lenis/react';
import { firstTime, recall, remember } from '@/lib/interaction/memory';
import { initTone, playTone, setMuted } from '@/lib/interaction/tone';
import { SCRIPT } from '@/lib/interaction/script';
import type { Project } from '@/lib/data';

export type Mood = 'idle' | 'curious' | 'excited' | 'focused' | 'thinking' | 'success' | 'discovery' | 'farewell';

interface Bubble {
  id: number;
  text: string;
  mood?: Mood;
  hold: number;
}

interface SayOptions {
  /** Session key: the line is spoken at most once per session. */
  once?: string;
  mood?: Mood;
  hold?: number;
}

interface CompanionValue {
  isClient: boolean;
  mood: Mood;
  setMood: (mood: Mood, revertMs?: number) => void;
  bubble: Bubble | null;
  say: (text: string, opts?: SayOptions) => void;
  poke: () => void;
  celebrate: (kind?: 'discover' | 'success') => void;
  visitorName: string;
  setVisitorName: (raw: string) => void;
  isSoundOn: boolean;
  toggleSound: () => void;
  isPreloaded: boolean;
  finishPreload: () => void;
  isIntroDone: boolean;
  finishIntro: () => void;
  /** Preloader and intro are both out of the way. */
  isReady: boolean;
  isTerminalOpen: boolean;
  setTerminalOpen: (open: boolean) => void;
  isTldrOpen: boolean;
  setTldrOpen: (open: boolean) => void;
  storyProject: Project | null;
  setStoryProject: (p: Project | null) => void;
  isMenuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  glideTo: (target: string | HTMLElement | number, duration?: number) => void;
}

const Ctx = createContext<CompanionValue | null>(null);

const noopSubscribe = () => () => undefined;
const MAX_QUEUE = 2;

export function CompanionProvider({ children }: { children: ReactNode }) {
  const lenis = useLenis();
  const isClient = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const [mood, setMoodState] = useState<Mood>('curious');
  const [bubble, setBubble] = useState<Bubble | null>(null);
  const [visitorName, setVisitorNameState] = useState('');
  const [isSoundOn, setSoundOn] = useState(true);
  const [isPreloaded, setPreloaded] = useState(false);
  const [isIntroDone, setIntroDone] = useState(false);
  const [isTerminalOpen, setTerminalOpen] = useState(false);
  const [isTldrOpen, setTldrOpen] = useState(false);
  const [storyProject, setStoryProject] = useState<Project | null>(null);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const queue = useRef<Bubble[]>([]);
  const isSpeaking = useRef(false);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pokeIndex = useRef(0);
  const nextId = useRef(0);
  // Bumped when a bubble finishes so the next queued line is pulled.
  const [drain, setDrain] = useState(0);

  // Session memory hydrates after mount so server and client markup match.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from sessionStorage */
    setVisitorNameState(recall('visitor-name') ?? '');
    setSoundOn(recall('sound') !== 'off');
    if (recall('intro-done')) setIntroDone(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
      if (moodTimer.current) clearTimeout(moodTimer.current);
    };
  }, []);

  useEffect(() => setMuted(!isSoundOn), [isSoundOn]);

  const later = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }, []);

  const setMood = useCallback((next: Mood, revertMs?: number) => {
    if (moodTimer.current) clearTimeout(moodTimer.current);
    moodTimer.current = null;
    setMoodState(next);
    if (revertMs) moodTimer.current = setTimeout(() => setMoodState('idle'), revertMs);
  }, []);

  const pump = useCallback(() => {
    if (isSpeaking.current) return;
    const next = queue.current.shift();
    if (!next) return;
    isSpeaking.current = true;
    setBubble(next);
    if (next.mood) setMood(next.mood, next.hold + 1200);
    later(() => {
      setBubble((b) => (b?.id === next.id ? null : b));
      later(() => {
        isSpeaking.current = false;
        setDrain((d) => d + 1);
      }, 450);
    }, next.hold);
  }, [later, setMood]);

  useEffect(() => {
    if (drain) pump();
  }, [drain, pump]);

  const say = useCallback(
    (text: string, opts: SayOptions = {}) => {
      if (!text) return;
      if (opts.once && !firstTime(`say:${opts.once}`)) return;
      // Capped queue: the site should never build up a monologue.
      if (queue.current.length >= MAX_QUEUE) return;
      queue.current.push({
        id: nextId.current++,
        text,
        mood: opts.mood,
        hold: opts.hold ?? Math.min(7000, Math.max(2800, 2400 + text.length * 34)),
      });
      pump();
    },
    [pump],
  );

  const celebrate = useCallback(
    (kind: 'discover' | 'success' = 'discover') => {
      setMood(kind === 'success' ? 'success' : 'discovery', 2600);
      playTone(kind);
    },
    [setMood],
  );

  const poke = useCallback(() => {
    initTone();
    const line = SCRIPT.pokes[pokeIndex.current % SCRIPT.pokes.length];
    pokeIndex.current += 1;
    setMood('excited', 1800);
    playTone('tap');
    say(line);
  }, [say, setMood]);

  const setVisitorName = useCallback((raw: string) => {
    const clean = raw.replace(/[<>]/g, '').trim().slice(0, 24);
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

  const finishPreload = useCallback(() => setPreloaded(true), []);
  const finishIntro = useCallback(() => {
    remember('intro-done');
    setIntroDone(true);
  }, []);

  // Scroll lock is derived from overlay state rather than counted, so it can never leak.
  const isLocked = !isPreloaded || !isIntroDone || isTerminalOpen || isTldrOpen || storyProject !== null || isMenuOpen;
  useEffect(() => {
    if (!lenis) return;
    if (isLocked) lenis.stop();
    else lenis.start();
  }, [lenis, isLocked]);

  const glideTo = useCallback(
    (target: string | HTMLElement | number, duration = 1.7) => {
      if (lenis) {
        lenis.scrollTo(target, { duration, offset: 0, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
        return;
      }
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (typeof el === 'number') window.scrollTo({ top: el, behavior: 'smooth' });
      else el?.scrollIntoView({ behavior: 'smooth' });
    },
    [lenis],
  );

  const value = useMemo<CompanionValue>(
    () => ({
      isClient,
      mood,
      setMood,
      bubble,
      say,
      poke,
      celebrate,
      visitorName,
      setVisitorName,
      isSoundOn,
      toggleSound,
      isPreloaded,
      finishPreload,
      isIntroDone,
      finishIntro,
      isReady: isPreloaded && isIntroDone,
      isTerminalOpen,
      setTerminalOpen,
      isTldrOpen,
      setTldrOpen,
      storyProject,
      setStoryProject,
      isMenuOpen,
      setMenuOpen,
      glideTo,
    }),
    [
      isClient, mood, setMood, bubble, say, poke, celebrate, visitorName, setVisitorName, isSoundOn, toggleSound,
      isPreloaded, finishPreload, isIntroDone, finishIntro, isTerminalOpen, isTldrOpen, storyProject, isMenuOpen, glideTo,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCompanion(): CompanionValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCompanion must be used inside <CompanionProvider>');
  return ctx;
}
