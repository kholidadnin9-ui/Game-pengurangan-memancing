// Simple Web Audio sound effects (no external assets needed)
let ctx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = "sine",
  vol = 0.18
) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain);
  gain.connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noise(start: number, dur: number, vol = 0.12) {
  if (muted) return;
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const bufferSize = Math.floor(c.sampleRate * dur);
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = c.createBufferSource();
  src.buffer = buffer;
  const gain = c.createGain();
  gain.gain.setValueAtTime(vol, t0);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(c.destination);
  src.start(t0);
}

export const sound = {
  setMuted(v: boolean) {
    muted = v;
  },
  isMuted() {
    return muted;
  },
  click() {
    tone(620, 0, 0.06, "square", 0.07);
  },
  cast() {
    tone(300, 0, 0.12, "sine", 0.1);
    noise(0.02, 0.18, 0.08);
  },
  correct() {
    tone(523.25, 0, 0.14, "sine", 0.2);
    tone(659.25, 0.12, 0.14, "sine", 0.2);
    tone(783.99, 0.24, 0.26, "sine", 0.22);
    noise(0.26, 0.2, 0.08);
  },
  wrong() {
    tone(233.08, 0, 0.18, "sawtooth", 0.12);
    tone(185.0, 0.16, 0.26, "sawtooth", 0.12);
  },
  escape() {
    tone(400, 0, 0.08, "sine", 0.1);
    tone(300, 0.08, 0.1, "sine", 0.1);
    noise(0.05, 0.15, 0.07);
  },
  levelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, i) => tone(n, i * 0.13, 0.3, "sine", 0.2));
  },
};
