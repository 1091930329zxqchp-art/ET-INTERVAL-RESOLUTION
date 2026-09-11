/**
 * Web Audio API Synthesizer for Notes, Intervals, and Chords
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Convert MIDI note number to frequency (Hz)
   * 69 = A4 = 440Hz
   */
  public midiToFreq(midi: number): number {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  /**
   * Play a single note with rich acoustic harmonics (fundamental + overtones + soft hammer noise)
   */
  public playNote(midi: number, duration: number = 0.9, startTimeOffset: number = 0) {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime + startTimeOffset;
      const freq = this.midiToFreq(midi);

      // Main Gain Node
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);

      // Harmonics synthesis for acoustic piano/electric piano warmth
      const harmonics = [
        { mult: 1, gain: 0.6 },
        { mult: 2, gain: 0.25 },
        { mult: 3, gain: 0.12 },
        { mult: 4, gain: 0.05 },
      ];

      harmonics.forEach(({ mult, gain: hGain }) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Triangle / sine blend for warm rounded tone
        osc.type = mult === 1 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq * mult, now);

        // Envelope: quick attack, natural exponential decay
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(hGain * 0.4, now + 0.015);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + duration + 0.05);
      });
    } catch {
      // Audio context might fail if user hasn't interacted yet
    }
  }

  /**
   * Play an interval: either melodically (one after another) or harmonically (both together)
   */
  public playInterval(midi1: number, midi2: number, mode: 'harmonic' | 'melodic' = 'melodic') {
    if (this.isMuted) return;
    if (mode === 'harmonic') {
      this.playNote(midi1, 1.2, 0);
      this.playNote(midi2, 1.2, 0);
    } else {
      // Melodic: note 1 first, then note 2, then both together softly
      this.playNote(midi1, 0.6, 0);
      this.playNote(midi2, 0.7, 0.45);
      this.playNote(midi1, 1.0, 1.15);
      this.playNote(midi2, 1.0, 1.15);
    }
  }

  /**
   * Play an interval resolution: e.g. d5 resolving to M3!
   */
  public playResolution(
    top1: number,
    bottom1: number,
    top2: number,
    bottom2: number
  ) {
    if (this.isMuted) return;
    // Step 1: Play dissonance (e.g. d5 or A4)
    this.playNote(bottom1, 0.8, 0);
    this.playNote(top1, 0.8, 0);

    // Step 2: Play resolution (e.g. M3 or m6)
    this.playNote(bottom2, 1.2, 0.9);
    this.playNote(top2, 1.2, 0.9);
  }

  /**
   * Play success chime
   */
  public playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.4);
      });
    } catch {
      // Ignore audio error
    }
  }

  /**
   * Play gentle error buzz
   */
  public playError() {
    if (this.isMuted) return;
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // Ignore audio error
    }
  }
}

export const sound = new SoundEngine();
