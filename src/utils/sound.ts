// Simple Web Audio API wrapper for retro sounds
class SoundManager {
  private context: AudioContext | null = null;
  private enabled = true;

  constructor() {
    // Initialize on first user interaction
    document.addEventListener('click', () => this.init(), { once: true });
  }

  private init() {
    if (!this.context) {
      this.context = new AudioContext();
    }
  }

  // Generate a simple beep sound
  playBeep(frequency = 440, duration = 0.1, type: OscillatorType = 'square') {
    if (!this.enabled || !this.context) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + duration);

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + duration);
  }

  // UI interaction sounds
  click() {
    this.playBeep(800, 0.05);
  }

  hover() {
    this.playBeep(600, 0.03);
  }

  select() {
    this.playBeep(1000, 0.08);
  }

  error() {
    this.playBeep(200, 0.15, 'sawtooth');
  }

  toggle() {
    this.enabled = !this.enabled;
  }
}

export const soundManager = new SoundManager();
