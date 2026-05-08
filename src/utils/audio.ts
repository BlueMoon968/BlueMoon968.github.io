let ctx: AudioContext | null = null
let muted = false

try { muted = localStorage.getItem('bm_mute') === '1' } catch { /* */ }

function ensureCtx(): AudioContext | null {
  if (!ctx) {
    try { ctx = new AudioContext() } catch { ctx = null }
  }
  return ctx
}

export function blip(freq = 880, duration = 0.06, type: OscillatorType = 'square', vol = 0.04) {
  if (muted) return
  const c = ensureCtx()
  if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(vol, t + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

export function chord(freqs: number[], dur = 0.08) {
  freqs.forEach((f, i) => setTimeout(() => blip(f, dur), i * 50))
}

export function setMuted(m: boolean) {
  muted = m
  try { localStorage.setItem('bm_mute', m ? '1' : '0') } catch { /* */ }
}

export function isMuted() { return muted }
