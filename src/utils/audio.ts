// Web Audio API sound effect synthesizers for real-time mechanical and interactive audio feedback.
// Since these are fully synthesized, they require 0kb of network overhead and work instantly.

class AudioFeedbackController {
  private getContext(): AudioContext | null {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return null;
      return new AudioCtx();
    } catch {
      return null;
    }
  }

  // Soft mechanical button click feedback
  public playClick() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.01);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.07);
  }

  // Elegant soft hover notification pop tick
  public playHover() {
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.02, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  // Synthesized upward melodic pluck for opening panels or expanding elements
  public playOpen() {
    const ctx = this.getContext();
    if (!ctx) return;

    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C major chord build
    const playArpeggioNode = (freq: number, delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0.0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.18);
    };

    frequencies.forEach((freq, idx) => {
      playArpeggioNode(freq, idx * 0.035);
    });
  }

  // Downward mellow sweep for closing panels or back actions
  public playClose() {
    const ctx = this.getContext();
    if (!ctx) return;

    const frequencies = [523.25, 392.00, 329.63, 261.63]; // Descending arpeggio
    const playArpeggioNode = (freq: number, delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0.0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.15);
    };

    frequencies.forEach((freq, idx) => {
      playArpeggioNode(freq, idx * 0.025);
    });
  }

  // Rewarding positive chime sound for form submissions
  public playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;

    const playTone = (freq: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 1.5, startTime); // subtle harmony

      gain.gain.setValueAtTime(0.0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc2.start(startTime);
      osc.stop(startTime + duration);
      osc2.stop(startTime + duration);
    };

    // Uplifting sequence of happy synth tones
    const now = ctx.currentTime;
    playTone(392.00, now, 0.12);        // G5
    playTone(523.25, now + 0.08, 0.12);   // C6
    playTone(659.25, now + 0.16, 0.25);   // E6
    playTone(1046.50, now + 0.28, 0.40);  // C7
  }
}

export const playSound = new AudioFeedbackController();
