// Simple sound generator using Web Audio API
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  playTone(frequency, duration, type = 'sine') {
    if (!this.audioContext || !this.enabled) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Sound effects
  playAdd() {
    this.playTone(800, 0.2, 'sine');
    setTimeout(() => this.playTone(1000, 0.1, 'sine'), 100);
  }

  playComplete() {
    this.playTone(523, 0.1, 'sine'); // C
    setTimeout(() => this.playTone(659, 0.1, 'sine'), 100); // E
    setTimeout(() => this.playTone(784, 0.2, 'sine'), 200); // G
  }

  playDelete() {
    this.playTone(400, 0.3, 'sawtooth');
  }

  playEdit() {
    this.playTone(600, 0.1, 'square');
  }

  playTabSwitch() {
    this.playTone(500, 0.15, 'sine');
    setTimeout(() => this.playTone(600, 0.15, 'sine'), 50);
  }

  playUndo() {
    this.playTone(300, 0.1, 'sine');
    setTimeout(() => this.playTone(250, 0.1, 'sine'), 100);
    setTimeout(() => this.playTone(200, 0.1, 'sine'), 200);
  }

  playError() {
    this.playTone(200, 0.2, 'sawtooth');
    setTimeout(() => this.playTone(150, 0.2, 'sawtooth'), 200);
  }
}

// Create a singleton instance
const soundManager = new SoundManager();

// Add methods to control sound
soundManager.setEnabled = function(enabled) {
  this.enabled = enabled;
};

soundManager.toggle = function() {
  this.enabled = !this.enabled;
  return this.enabled;
};

export default soundManager; 