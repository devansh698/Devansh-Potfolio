/**
 * Micro-synth for interaction feedback — generated blips, no audio assets.
 * Master gain is kept low so it reads as tactile feedback, not music. Audio is decorative:
 * every failure is swallowed so it can never break the page.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export type Cue = 'tap' | 'hover' | 'open' | 'close' | 'wake' | 'discover' | 'success' | 'farewell' | 'type' | 'whoosh';

/** Must run inside a user gesture — browsers block audio before one. */
export function initTone(): void {
  if (typeof window === 'undefined') return;
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    return;
  }
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.16;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
}

export function isToneReady(): boolean {
  return ctx !== null && ctx.state === 'running';
}

/** Filtered noise sweep — the "air" sound for big scroll moments. */
function whoosh(at: number, dur = 0.9): void {
  if (!ctx || !master) return;
  const length = Math.floor(ctx.sampleRate * dur);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(300, at);
  filter.frequency.exponentialRampToValueAtTime(2800, at + dur * 0.6);
  filter.frequency.exponentialRampToValueAtTime(600, at + dur);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.9, at + dur * 0.4);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  src.connect(filter).connect(gain).connect(master);
  src.start(at);
  src.stop(at + dur + 0.05);
}

export function setMuted(value: boolean): void {
  muted = value;
}

function note(freq: number, at: number, dur: number, type: OscillatorType = 'triangle', peak = 1): void {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(peak, at + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  osc.connect(gain).connect(master);
  osc.start(at);
  osc.stop(at + dur + 0.05);
}

// Pitch language: up = opening/positive, down = closing, arpeggio = celebration.
const CUES: Record<Cue, (t: number) => void> = {
  whoosh: (t) => whoosh(t),
  tap: (t) => note(660, t, 0.07, 'square', 0.5),
  hover: (t) => note(1320, t, 0.04, 'sine', 0.18),
  type: (t) => note(1200 + Math.random() * 300, t, 0.025, 'square', 0.15),
  open: (t) => {
    note(440, t, 0.1);
    note(660, t + 0.09, 0.12);
  },
  close: (t) => {
    note(660, t, 0.09);
    note(440, t + 0.08, 0.12);
  },
  wake: (t) => {
    note(330, t, 0.16, 'sine');
    note(495, t + 0.14, 0.2, 'sine');
  },
  discover: (t) => {
    note(523, t, 0.09);
    note(659, t + 0.08, 0.09);
    note(784, t + 0.16, 0.14);
  },
  success: (t) => {
    note(523, t, 0.1);
    note(659, t + 0.09, 0.1);
    note(784, t + 0.18, 0.1);
    note(1047, t + 0.27, 0.22);
  },
  farewell: (t) => {
    note(587, t, 0.14, 'sine');
    note(440, t + 0.16, 0.24, 'sine');
  },
};

export function playTone(name: Cue): void {
  if (!ctx || muted) return;
  try {
    if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
    CUES[name](ctx.currentTime);
  } catch {
    // decorative only
  }
}
