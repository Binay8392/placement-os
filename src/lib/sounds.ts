// Simple Web Audio API sound generator for notifications
// No external dependencies needed

type SoundType = 'start' | 'milestone' | 'stop' | 'tick';

interface SoundOptions {
  frequency?: number;
  duration?: number;
  volume?: number;
  type?: OscillatorType;
}

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private playTone(options: SoundOptions = {}) {
    if (!this.enabled) return;

    const {
      frequency = 440,
      duration = 0.2,
      volume = 0.3,
      type = 'sine'
    } = options;

    try {
      const ctx = this.getContext();
      
      // Resume context if suspended (required after user interaction)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }

  play(soundType: SoundType) {
    switch (soundType) {
      case 'start':
        // Rising tone - energizing
        this.playTone({ frequency: 523, duration: 0.15, type: 'sine' });
        setTimeout(() => this.playTone({ frequency: 659, duration: 0.15, type: 'sine' }), 100);
        setTimeout(() => this.playTone({ frequency: 784, duration: 0.2, type: 'sine' }), 200);
        break;

      case 'milestone':
        // Achievement chime - celebratory
        this.playTone({ frequency: 880, duration: 0.1, type: 'sine', volume: 0.25 });
        setTimeout(() => this.playTone({ frequency: 1109, duration: 0.1, type: 'sine', volume: 0.25 }), 100);
        setTimeout(() => this.playTone({ frequency: 1319, duration: 0.15, type: 'sine', volume: 0.3 }), 200);
        setTimeout(() => this.playTone({ frequency: 1760, duration: 0.3, type: 'sine', volume: 0.35 }), 300);
        break;

      case 'stop':
        // Completion sound - satisfying
        this.playTone({ frequency: 659, duration: 0.15, type: 'triangle' });
        setTimeout(() => this.playTone({ frequency: 523, duration: 0.25, type: 'triangle' }), 150);
        break;

      case 'tick':
        // Subtle tick for each second (optional, off by default)
        this.playTone({ frequency: 1000, duration: 0.02, volume: 0.05, type: 'sine' });
        break;
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Pomodoro milestones in seconds
export const MILESTONES = {
  POMODORO: 25 * 60,      // 25 minutes
  SHORT_BREAK: 5 * 60,    // 5 minutes
  LONG_BREAK: 15 * 60,    // 15 minutes
  HALF_HOUR: 30 * 60,     // 30 minutes
  HOUR: 60 * 60,          // 1 hour
};

// Check if elapsed time hits a milestone
export const checkMilestone = (elapsed: number, previousElapsed: number): boolean => {
  const milestoneValues = Object.values(MILESTONES);
  
  for (const milestone of milestoneValues) {
    // Check if we just crossed this milestone
    if (previousElapsed < milestone && elapsed >= milestone) {
      return true;
    }
  }
  
  return false;
};

// Get milestone name for display
export const getMilestoneName = (elapsed: number): string | null => {
  if (elapsed === MILESTONES.POMODORO) return '25 min Pomodoro';
  if (elapsed === MILESTONES.HALF_HOUR) return '30 minutes';
  if (elapsed === MILESTONES.HOUR) return '1 hour';
  return null;
};
