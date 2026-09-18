/**
 * Micro-synth for interaction feedback — tiny generated blips, no audio
 * assets. Deliberately quiet (master gain ~0.05) so it reads as tactile
 * feedback, not sound design. Fails silently everywhere: audio must never
 * break the site.
 */
let ctx = null;
let master = null;
let muted = false;

/** Must be called from a user gesture (browsers block audio before one). */
export function initTone() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return;
  }
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.05;
    master.connect(ctx.destination);
  } catch {
    ctx = null;
  }
}

export function setMuted(m) {
  muted = m;
}

function note(freq, at, dur, { type = 'triangle', peak = 1 } = {}) {
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

/* Each cue is a tiny melodic gesture — pitch language: up = opening /
   positive, down = closing, arpeggio = celebration. */
const CUES = {
  tap:      (t) => note(660, t, 0.07, { type: 'square', peak: 0.5 }),
  hover:    (t) => note(880, t, 0.045, { type: 'sine', peak: 0.25 }),
  open:     (t) => { note(440, t, 0.1); note(660, t + 0.09, 0.12); },
  close:    (t) => { note(660, t, 0.09); note(440, t + 0.08, 0.12); },
  wake:     (t) => { note(330, t, 0.16, { type: 'sine' }); note(495, t + 0.14, 0.2, { type: 'sine' }); },
  discover: (t) => { note(523, t, 0.09); note(659, t + 0.08, 0.09); note(784, t + 0.16, 0.14); },
  success:  (t) => { note(523, t, 0.1); note(659, t + 0.09, 0.1); note(784, t + 0.18, 0.1); note(1047, t + 0.27, 0.22); },
  farewell: (t) => { note(587, t, 0.14, { type: 'sine' }); note(440, t + 0.16, 0.24, { type: 'sine' }); },
};

export function playTone(name) {
  if (!ctx || muted) return;
  try {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const cue = CUES[name];
    if (cue) cue(ctx.currentTime);
  } catch {
    /* audio is decorative — never surface errors */
  }
}
