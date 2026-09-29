// ==========================================================================
// V-SHIELD AUDIO ENGINE (Web Audio API Synthesizer)
// Provides Cyber Ambient BGM + Real-time SFX without external dependencies
// ==========================================================================

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmGain = null;
    this.sfxGain = null;
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.step = 0;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    // Master Gains
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.18; // ambient background level

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.35; // clear sound effects level

    this.bgmGain.connect(this.ctx.destination);
    this.sfxGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      if (this.isMuted) {
        this.bgmGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0, this.ctx.currentTime);
      } else {
        this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        this.sfxGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      }
    }
    return this.isMuted;
  }

  // --- Background Music: Synthwave Cyber Pulse ---
  startBgm() {
    this.ensureContext();
    if (this.isPlayingBgm || !this.ctx) return;
    this.isPlayingBgm = true;

    // Tempo: 124 BPM (approx 120ms per 16th note)
    const tempo = 124;
    const stepDuration = (60 / tempo) / 4; // 16th note

    // Cyber bass arpeggio notes in Hz (C minor / D minor tech feel)
    const bassNotes = [65.41, 65.41, 77.78, 65.41, 98.00, 65.41, 87.31, 65.41]; // C2, C2, Eb2, C2, G2, C2, F2, C2
    const leadNotes = [261.63, 311.13, 392.00, 466.16, 523.25, 392.00, 311.13, 261.63];

    let currentStep = 0;
    const scheduleNext = () => {
      if (!this.isPlayingBgm || !this.ctx) return;

      const now = this.ctx.currentTime;
      // Play Bass Pulse on every 16th note
      const bassFreq = bassNotes[currentStep % bassNotes.length];
      this.playBassNote(bassFreq, now, stepDuration * 0.85);

      // Play Lead Arp on every 4th note
      if (currentStep % 2 === 0) {
        const leadFreq = leadNotes[(Math.floor(currentStep / 2)) % leadNotes.length];
        this.playLeadNote(leadFreq, now, stepDuration * 1.5);
      }

      // Hi-hat tech tick
      if (currentStep % 2 === 1) {
        this.playHiHat(now);
      }

      currentStep++;
      this.bgmTimer = setTimeout(scheduleNext, stepDuration * 1000);
    };

    scheduleNext();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playBassNote(freq, time, dur) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);
    filter.Q.setValueAtTime(3, time);

    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  playLeadNote(freq, time, dur) {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.12, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  playHiHat(time) {
    if (!this.ctx || this.isMuted) return;
    // White noise tick
    const bufferSize = this.ctx.sampleRate * 0.03;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(8000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    noise.start(time);
  }

  // --- Sound Effects (SFX) ---

  // Whoosh transition between scenes
  playWhoosh() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.45;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.45);
    filter.Q.setValueAtTime(2, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start(now);
  }

  // Laser Scan Beep (Face ID / LPR scanning)
  playScan() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.18);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Access Granted Chime (Modern harmonic double ding)
  playSuccess() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    [
      { f: 587.33, t: 0, d: 0.2 },      // D5
      { f: 880.00, t: 0.1, d: 0.35 }    // A5
    ].forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.25, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d);
    });
  }

  // Access Denied Alarm Buzz
  playAlarm() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    [0, 0.15].forEach(delay => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now + delay);
      osc.frequency.setValueAtTime(130, now + delay + 0.08);

      gain.gain.setValueAtTime(0.35, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.12);
    });
  }

  // Barrier Servo Hum
  playBarrier() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(440, now + 0.4);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  // Click UI
  playClick() {
    this.ensureContext();
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }
}

window.audioManager = new AudioManager();
