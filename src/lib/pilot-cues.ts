export const PILOT_CUES_KEY = "starwall-pilot-cues";
export const PILOT_VOICE_KEY = "starwall-pilot-voice";

export type PilotCue =
  | "open"
  | "demo"
  | "listen"
  | "speak"
  | "scan"
  | "note"
  | "ack"
  | "posted"
  | "warn"
  | "urgent"
  | "error"
  | "stop";

export type CueNote = {
  freq: number;
  start: number;
  dur: number;
  gain: number;
  wave: OscillatorType;
};

export const CUE_NOTES: Record<PilotCue, CueNote[]> = {
  open: [
    { freq: 523.25, start: 0, dur: 0.09, gain: 0.07, wave: "sine" },
    { freq: 659.25, start: 0.08, dur: 0.12, gain: 0.06, wave: "sine" },
  ],
  demo: [
    { freq: 440, start: 0, dur: 0.07, gain: 0.06, wave: "sine" },
    { freq: 554.37, start: 0.07, dur: 0.07, gain: 0.07, wave: "sine" },
    { freq: 659.25, start: 0.14, dur: 0.1, gain: 0.06, wave: "sine" },
  ],
  listen: [{ freq: 880, start: 0, dur: 0.05, gain: 0.05, wave: "triangle" }],
  speak: [
    { freq: 392, start: 0, dur: 0.07, gain: 0.05, wave: "sine" },
    { freq: 493.88, start: 0.06, dur: 0.09, gain: 0.05, wave: "sine" },
  ],
  scan: [
    { freq: 587.33, start: 0, dur: 0.06, gain: 0.05, wave: "triangle" },
    { freq: 440, start: 0.07, dur: 0.08, gain: 0.04, wave: "triangle" },
  ],
  note: [
    { freq: 784, start: 0, dur: 0.08, gain: 0.06, wave: "sine" },
    { freq: 1046.5, start: 0.07, dur: 0.14, gain: 0.05, wave: "sine" },
  ],
  ack: [
    { freq: 349.23, start: 0, dur: 0.05, gain: 0.05, wave: "sine" },
    { freq: 523.25, start: 0.05, dur: 0.07, gain: 0.05, wave: "sine" },
  ],
  posted: [
    { freq: 329.63, start: 0, dur: 0.05, gain: 0.05, wave: "sine" },
    { freq: 392, start: 0.05, dur: 0.05, gain: 0.05, wave: "sine" },
    { freq: 523.25, start: 0.1, dur: 0.09, gain: 0.05, wave: "sine" },
  ],
  warn: [
    { freq: 739.99, start: 0, dur: 0.09, gain: 0.09, wave: "square" },
    { freq: 587.33, start: 0.1, dur: 0.12, gain: 0.08, wave: "square" },
  ],
  urgent: [
    { freq: 880, start: 0, dur: 0.07, gain: 0.1, wave: "square" },
    { freq: 659.25, start: 0.09, dur: 0.07, gain: 0.09, wave: "square" },
    { freq: 880, start: 0.18, dur: 0.1, gain: 0.1, wave: "square" },
  ],
  error: [
    { freq: 220, start: 0, dur: 0.1, gain: 0.07, wave: "sine" },
    { freq: 164.81, start: 0.1, dur: 0.14, gain: 0.07, wave: "sine" },
  ],
  stop: [
    { freq: 659.25, start: 0, dur: 0.08, gain: 0.05, wave: "sine" },
    { freq: 523.25, start: 0.08, dur: 0.12, gain: 0.04, wave: "sine" },
  ],
};

export type CueStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

function defaultStorage(): CueStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function cuesEnabled(storage?: CueStorage | null): boolean {
  const store = storage === undefined ? defaultStorage() : storage;
  if (!store) return true;
  return store.getItem(PILOT_CUES_KEY) !== "off";
}

export function writeCuesEnabled(on: boolean, storage?: CueStorage | null) {
  const store = storage === undefined ? defaultStorage() : storage;
  if (!store) return;
  store.setItem(PILOT_CUES_KEY, on ? "on" : "off");
}

export function voiceEnabled(storage?: CueStorage | null): boolean {
  const store = storage === undefined ? defaultStorage() : storage;
  if (!store) return true;
  return store.getItem(PILOT_VOICE_KEY) !== "off";
}

export function writeVoiceEnabled(on: boolean, storage?: CueStorage | null) {
  const store = storage === undefined ? defaultStorage() : storage;
  if (!store) return;
  store.setItem(PILOT_VOICE_KEY, on ? "on" : "off");
}

export function cueForDemoBeat(beat: {
  role: "officer" | "pilot";
  focus: "instruments" | "advice" | "comms" | "voice" | "calls";
  tone: "brief" | "warn";
  speak: boolean;
}): PilotCue {
  if (beat.role === "officer") return "listen";
  if (beat.tone === "warn") return "warn";
  if (beat.focus === "instruments") return "scan";
  if (beat.focus === "advice") return "note";
  if (beat.focus === "comms") return "posted";
  if (beat.focus === "voice" && !beat.speak) return "stop";
  return "speak";
}

export function cueDurationMs(kind: PilotCue) {
  return Math.ceil(
    CUE_NOTES[kind].reduce((max, note) => Math.max(max, note.start + note.dur), 0) * 1000,
  );
}

let lastPlay = { kind: "" as string, at: 0 };

export function playPilotCue(kind: PilotCue, enabled = true) {
  if (!enabled || typeof window === "undefined") return false;
  const now = Date.now();
  if (lastPlay.kind === kind && now - lastPlay.at < 180) return false;
  lastPlay = { kind, at: now };
  const Ctor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return false;
  const ctx = new Ctor();
  const notes = CUE_NOTES[kind];
  const t0 = ctx.currentTime + 0.012;
  for (const note of notes) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = note.wave;
    osc.frequency.value = note.freq;
    const start = t0 + note.start;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(note.gain, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + note.dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + note.dur + 0.02);
  }
  void ctx.resume();
  window.setTimeout(() => void ctx.close(), cueDurationMs(kind) + 80);
  return true;
}
