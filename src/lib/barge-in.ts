/** Mic energy and duration that count as the officer cutting in over Pilot. */
export const BARGE_RMS = 0.12;
export const BARGE_FRAMES = 10;
export const BARGE_GRACE_MS = 520;
export const BARGE_MIN_CHARS = 2;
/** Ignore leftover speech-to-text after Pilot finishes talking. */
export const ECHO_COOLDOWN_MS = 1400;

export function heardWhilePilotTalks(
  speaking: boolean,
  endedAt: number,
  now: number,
) {
  if (speaking) return true;
  return now - endedAt < ECHO_COOLDOWN_MS;
}

export function normalizeHeard(text: string) {
  return text
    .toLowerCase()
    .replace(/[.,!?;:()[\]{}"'`«»…—–-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when the recognizer likely echoed Pilot's own playback. */
export function isEchoOfSpoken(heard: string, spoken: string) {
  const a = normalizeHeard(heard);
  const b = normalizeHeard(spoken);
  if (!a || a.length < BARGE_MIN_CHARS) return true;
  if (!b) return false;
  if (b.includes(a) || a.includes(b)) return true;
  const heardWords = a.split(" ").filter((word) => word.length > 2);
  if (!heardWords.length) return false;
  const spokenWords = new Set(b.split(" ").filter((word) => word.length > 2));
  const overlap = heardWords.filter((word) => spokenWords.has(word)).length;
  return overlap / heardWords.length >= 0.7;
}

export function shouldCutIn(heard: string, spoken: string, startedAt: number, now: number) {
  if (now - startedAt < BARGE_GRACE_MS) return false;
  if (isEchoOfSpoken(heard, spoken)) return false;
  return normalizeHeard(heard).length >= BARGE_MIN_CHARS;
}

export function vadHotFrames(rms: number, previous: number) {
  if (rms >= BARGE_RMS) return previous + 1;
  return Math.max(0, previous - 2);
}

export function vadTriggered(hot: number) {
  return hot >= BARGE_FRAMES;
}
