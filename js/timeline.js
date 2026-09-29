// ==========================================================================
// V-SHIELD TIMELINE CONTROLLER
// 60-second precise playback, scrubbing, speed control & scene synchronization
// ==========================================================================

class Timeline {
  constructor() {
    this.duration = 60.0; // 60 seconds exactly
    this.currentTime = 0.0;
    this.isPlaying = false;
    this.speed = 1.0;
    this.lastFrameTimestamp = null;
    this.animFrameId = null;

    // UI Elements
    this.playBtn = document.getElementById('btn-play');
    this.restartBtn = document.getElementById('btn-restart');
    this.timeDisplay = document.getElementById('time-display');
    this.hudTimecode = document.getElementById('hud-timecode');
    this.progressFill = document.getElementById('progress-fill');
    this.scrubThumb = document.getElementById('scrub-thumb');
    this.trackContainer = document.getElementById('timeline-track');
    this.subtitleText = document.getElementById('subtitle-text');
    this.speedSelect = document.getElementById('speed-select');
    this.audioBtn = document.getElementById('btn-audio');
    this.voiceBtn = document.getElementById('btn-voice');

    this.isDraggingScrubber = false;
    this.bindEvents();
  }

  bindEvents() {
    // Play/Pause button
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    // Restart button
    if (this.restartBtn) {
      this.restartBtn.addEventListener('click', () => {
        this.seek(0);
        this.play();
      });
    }

    // Keyboard Spacebar to toggle play/pause
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
        e.preventDefault();
        this.togglePlay();
      } else if (e.code === 'ArrowRight') {
        this.seek(Math.min(this.duration, this.currentTime + 3));
      } else if (e.code === 'ArrowLeft') {
        this.seek(Math.max(0, this.currentTime - 3));
      }
    });

    // Timeline Track Scrubbing
    if (this.trackContainer) {
      const handleScrub = (e) => {
        const rect = this.trackContainer.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        this.seek(percent * this.duration);
      };

      this.trackContainer.addEventListener('mousedown', (e) => {
        this.isDraggingScrubber = true;
        handleScrub(e);
      });

      window.addEventListener('mousemove', (e) => {
        if (this.isDraggingScrubber) handleScrub(e);
      });

      window.addEventListener('mouseup', () => {
        this.isDraggingScrubber = false;
      });

      // Touch events for tablets/mobile
      this.trackContainer.addEventListener('touchstart', (e) => {
        this.isDraggingScrubber = true;
        handleScrub(e);
      });

      window.addEventListener('touchmove', (e) => {
        if (this.isDraggingScrubber) handleScrub(e);
      });

      window.addEventListener('touchend', () => {
        this.isDraggingScrubber = false;
      });
    }

    // Scene Jump buttons
    document.querySelectorAll('.scene-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const timeTarget = parseFloat(pill.getAttribute('data-time'));
        this.seek(timeTarget);
      });
    });

    // Playback Speed
    if (this.speedSelect) {
      this.speedSelect.addEventListener('change', (e) => {
        this.speed = parseFloat(e.target.value);
      });
    }

    // Audio SFX/BGM Toggle
    if (this.audioBtn) {
      this.audioBtn.addEventListener('click', () => {
        if (window.audioManager) {
          const isMuted = window.audioManager.toggleMute();
          this.audioBtn.innerHTML = isMuted 
            ? '<span>🔇</span> Âm thanh: TẮT' 
            : '<span>🔊</span> Âm thanh: BẬT';
          this.audioBtn.classList.toggle('active', !isMuted);
        }
      });
    }

    // Voiceover Toggle
    if (this.voiceBtn) {
      this.voiceBtn.addEventListener('click', () => {
        if (window.speechManager) {
          const isEnabled = window.speechManager.toggleVoice();
          this.voiceBtn.innerHTML = isEnabled 
            ? '<span>🎙</span> Thuyết minh: BẬT' 
            : '<span>🎙</span> Thuyết minh: TẮT';
          this.voiceBtn.classList.toggle('active', isEnabled);
        }
      });
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.currentTime >= this.duration) {
      this.currentTime = 0.0;
    }
    this.isPlaying = true;
    this.lastFrameTimestamp = performance.now();

    if (this.playBtn) {
      this.playBtn.innerHTML = '<span>⏸</span> TẠM DỪNG';
      this.playBtn.style.background = 'linear-gradient(135deg, #ffb703, #ff9900)';
    }

    // Play user background audio track
    const bgmAudio = document.getElementById('bgm-audio');
    if (bgmAudio) {
      bgmAudio.currentTime = this.currentTime;
      bgmAudio.play().catch(() => {});
    }

    // Start background cyber synth fallback
    if (window.audioManager) {
      window.audioManager.ensureContext();
      window.audioManager.startBgm();
    }

    this.tick();
  }

  pause() {
    this.isPlaying = false;
    this.lastFrameTimestamp = null;
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.playBtn) {
      this.playBtn.innerHTML = '<span>▶</span> PHÁT VIDEO';
      this.playBtn.style.background = 'linear-gradient(135deg, var(--cyan), #00c0fa)';
    }

    const bgmAudio = document.getElementById('bgm-audio');
    if (bgmAudio) {
      bgmAudio.pause();
    }

    if (window.audioManager) {
      window.audioManager.stopBgm();
    }

    if (window.speechManager) {
      window.speechManager.reset();
    }
  }

  seek(time) {
    this.currentTime = Math.max(0, Math.min(this.duration, time));
    this.updateUI();

    const bgmAudio = document.getElementById('bgm-audio');
    if (bgmAudio) {
      bgmAudio.currentTime = this.currentTime;
    }

    if (window.sceneManager) {
      window.sceneManager.update(this.currentTime);
    }
    if (window.speechManager) {
      window.speechManager.update(this.currentTime, this.subtitleText);
    }
  }

  tick() {
    if (!this.isPlaying) return;

    const now = performance.now();
    if (this.lastFrameTimestamp) {
      const deltaSeconds = (now - this.lastFrameTimestamp) / 1000.0;
      this.currentTime += deltaSeconds * this.speed;

      if (this.currentTime >= this.duration) {
        this.currentTime = this.duration;
        this.updateUI();
        if (window.sceneManager) window.sceneManager.update(this.currentTime);
        if (window.speechManager) window.speechManager.update(this.currentTime, this.subtitleText);
        this.pause();
        return;
      }
    }
    this.lastFrameTimestamp = now;

    this.updateUI();

    // Call scene and speech updates
    if (window.sceneManager) {
      window.sceneManager.update(this.currentTime);
    }
    if (window.speechManager) {
      window.speechManager.update(this.currentTime, this.subtitleText);
    }

    this.animFrameId = requestAnimationFrame(() => this.tick());
  }

  updateUI() {
    // Format minutes:seconds
    const currentMins = Math.floor(this.currentTime / 60);
    const currentSecs = Math.floor(this.currentTime % 60);
    const totalMins = Math.floor(this.duration / 60);
    const totalSecs = Math.floor(this.duration % 60);

    const pad = (n) => String(n).padStart(2, '0');
    const formatted = `${pad(currentMins)}:${pad(currentSecs)} / ${pad(totalMins)}:${pad(totalSecs)}`;

    if (this.timeDisplay) {
      this.timeDisplay.textContent = formatted;
    }

    // Timecode with frames: 00:SS:FF
    const frames = Math.floor((this.currentTime % 1) * 30); // 30fps frames
    if (this.hudTimecode) {
      this.hudTimecode.textContent = `TC 00:${pad(currentSecs)}:${pad(frames)}`;
    }

    // Progress bar & scrub thumb
    const percent = (this.currentTime / this.duration) * 100;
    if (this.progressFill) {
      this.progressFill.style.width = `${percent}%`;
    }
    if (this.scrubThumb) {
      this.scrubThumb.style.left = `${percent}%`;
    }
  }
}

window.timeline = new Timeline();
