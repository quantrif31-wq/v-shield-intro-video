// ==========================================================================
// V-SHIELD SCENE ANIMATOR & TRANSITIONS ENGINE (PRO CINEMATIC EDITION)
// Handles deterministic 60fps animations, 4 creative sci-fi transitions,
// and 3-stage founder spotlight & convergence in Scene 5.
// ==========================================================================

class SceneManager {
  constructor() {
    this.currentSceneId = 1;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.lastTriggeredSecond = -1;
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.getElementById('renderCanvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Create ambient floating cyber particles
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * (this.canvas.width || 1920),
        y: Math.random() * (this.canvas.height || 1080),
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.7 - 0.2,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.6 ? '#00f2fe' : (Math.random() > 0.4 ? '#00ff87' : '#38bdf8'),
        alpha: Math.random() * 0.6 + 0.2
      });
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    if (document.body.classList.contains('export-mode')) {
      this.canvas.width = 1920;
      this.canvas.height = 1080;
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width || 1920;
    this.canvas.height = rect.height || 1080;
  }

  update(time) {
    if (!this.ctx || !this.canvas) return;
    if (document.body.classList.contains('export-mode') && (this.canvas.width !== 1920 || this.canvas.height !== 1080)) {
      this.resizeCanvas();
    }

    // 1. Manage Active Scenes & Smooth Physical Transitions
    this.manageScenes(time);

    // 2. Clear canvas & render cyber background
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    ctx.clearRect(0, 0, w, h);

    this.renderAmbientBackground(ctx, w, h, time);

    // 3. Render 4 Creative Visual Transitions on Canvas
    this.renderTransitions(ctx, w, h, time);

    // 4. Animate Scene internal elements
    this.animateScene(this.currentSceneId, time);
    this.checkSoundCues(time);
  }

  // ==========================================================================
  // PHYSICAL DOM SCENE TRANSITIONS (Both Outgoing & Incoming Animate Smoothly)
  // ==========================================================================
  manageScenes(time) {
    const sc1 = document.getElementById('scene-1');
    const sc2 = document.getElementById('scene-2');
    const sc3 = document.getElementById('scene-3');
    const sc4 = document.getElementById('scene-4');
    const sc5 = document.getElementById('scene-5');
    const scenes = [null, sc1, sc2, sc3, sc4, sc5];

    const resetScene = (sc) => {
      if (!sc) return;
      sc.style.display = 'none';
      sc.style.transform = 'none';
      sc.style.opacity = '0';
      sc.style.filter = 'none';
      sc.style.clipPath = 'none';
      sc.style.zIndex = '';
      sc.classList.remove('active');
    };

    const showNormal = (activeId) => {
      for (let i = 1; i <= 5; i++) {
        if (!scenes[i]) continue;
        if (i === activeId) {
          scenes[i].style.display = 'flex';
          scenes[i].style.transform = 'none';
          scenes[i].style.opacity = '1';
          scenes[i].style.filter = 'none';
          scenes[i].style.clipPath = 'none';
          scenes[i].style.zIndex = '1';
          scenes[i].classList.add('active');
        } else {
          resetScene(scenes[i]);
        }
      }
      this.currentSceneId = activeId;
    };

    // -------------------------------------------------------------
    // TRANSITION 1: Scene 1 -> 2 (9.2s - 10.6s)
    // 3D Perspective Cube Flip & Digital Glitch Displacement
    // -------------------------------------------------------------
    if (time >= 9.2 && time <= 10.6) {
      this.currentSceneId = (time < 10.0) ? 1 : 2;
      for (let i = 3; i <= 5; i++) resetScene(scenes[i]);

      const p = (time - 9.2) / 1.4; // 0 to 1
      if (sc1) {
        sc1.style.display = 'flex';
        sc1.style.zIndex = '1';
        sc1.style.transform = `perspective(1200px) translateX(${(-p * 110).toFixed(1)}%) rotateY(${(-p * 32).toFixed(1)}deg) scale(${(1 - p * 0.22).toFixed(2)})`;
        sc1.style.opacity = Math.max(0, 1 - p * 1.15).toFixed(3);
        sc1.style.filter = `blur(${(p * 8).toFixed(1)}px)`;
        sc1.classList.add('active');
      }
      if (sc2) {
        sc2.style.display = 'flex';
        sc2.style.zIndex = '2';
        sc2.style.transform = `perspective(1200px) translateX(${((1 - p) * 110).toFixed(1)}%) rotateY(${((1 - p) * 32).toFixed(1)}deg) scale(${(0.78 + p * 0.22).toFixed(2)})`;
        sc2.style.opacity = Math.min(1, p * 1.3).toFixed(3);
        sc2.style.filter = `blur(${((1 - p) * 8).toFixed(1)}px)`;
        sc2.classList.add('active');
      }
    }
    // -------------------------------------------------------------
    // TRANSITION 2: Scene 2 -> 3 (21.2s - 22.6s)
    // High-Energy Neon Laser Blade Diagonal Slice & Wipe
    // -------------------------------------------------------------
    else if (time >= 21.2 && time <= 22.6) {
      this.currentSceneId = (time < 22.0) ? 2 : 3;
      resetScene(sc1);
      resetScene(sc4);
      resetScene(sc5);

      const p = (time - 21.2) / 1.4; // 0 to 1
      if (sc2) {
        sc2.style.display = 'flex';
        sc2.style.zIndex = '1';
        sc2.style.transform = `scale(${(1 + p * 0.08).toFixed(2)})`;
        sc2.style.opacity = Math.max(0, 1 - p * 0.55).toFixed(3);
        sc2.style.filter = 'none';
        sc2.style.clipPath = 'none';
        sc2.classList.add('active');
      }
      if (sc3) {
        sc3.style.display = 'flex';
        sc3.style.zIndex = '3';
        const topX = (p * 135).toFixed(1);
        const botX = (p * 135 - 28).toFixed(1);
        sc3.style.clipPath = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;
        sc3.style.transform = 'none';
        sc3.style.opacity = '1';
        sc3.style.filter = 'none';
        sc3.classList.add('active');
      }
    }
    // -------------------------------------------------------------
    // TRANSITION 3: Scene 3 -> 4 (39.2s - 40.6s)
    // Biometric Iris Vault Aperture Portal
    // -------------------------------------------------------------
    else if (time >= 39.2 && time <= 40.6) {
      this.currentSceneId = (time < 40.0) ? 3 : 4;
      resetScene(sc1);
      resetScene(sc2);
      resetScene(sc5);

      const p = (time - 39.2) / 1.4; // 0 to 1
      if (p < 0.5) {
        const pA = p / 0.5;
        if (sc3) {
          sc3.style.display = 'flex';
          sc3.style.zIndex = '1';
          sc3.style.transform = `scale(${(1 + pA * 0.6).toFixed(2)})`;
          sc3.style.opacity = Math.max(0, 1 - pA * 0.95).toFixed(3);
          sc3.style.filter = `blur(${(pA * 10).toFixed(1)}px)`;
          sc3.style.clipPath = 'none';
          sc3.classList.add('active');
        }
        if (sc4) resetScene(sc4);
      } else {
        const pB = (p - 0.5) / 0.5;
        if (sc3) resetScene(sc3);
        if (sc4) {
          sc4.style.display = 'flex';
          sc4.style.zIndex = '2';
          const r = (pB * 140).toFixed(1);
          sc4.style.clipPath = `circle(${r}% at 50% 50%)`;
          sc4.style.transform = `scale(${(0.72 + pB * 0.28).toFixed(2)})`;
          sc4.style.opacity = Math.min(1, pB * 1.4).toFixed(3);
          sc4.style.filter = 'none';
          sc4.classList.add('active');
        }
      }
    }
    // -------------------------------------------------------------
    // TRANSITION 4: Scene 4 -> 5 (49.2s - 50.6s)
    // Quantum Hyperspace Warp Tunnel & Blinding Supernova Burst
    // -------------------------------------------------------------
    else if (time >= 49.2 && time <= 50.6) {
      this.currentSceneId = (time < 50.0) ? 4 : 5;
      for (let i = 1; i <= 3; i++) resetScene(scenes[i]);

      const p = (time - 49.2) / 1.4; // 0 to 1
      if (p < 0.65) {
        if (sc4) {
          sc4.style.display = 'flex';
          sc4.style.zIndex = '1';
          sc4.style.transform = `scale(${(1 + p * 2.2).toFixed(2)})`;
          sc4.style.opacity = Math.max(0, 1 - p * 1.6).toFixed(3);
          sc4.style.filter = `blur(${(p * 15).toFixed(1)}px)`;
          sc4.style.clipPath = 'none';
          sc4.classList.add('active');
        }
      } else {
        if (sc4) resetScene(sc4);
      }

      if (p >= 0.55) {
        const pC = (p - 0.55) / 0.45;
        if (sc5) {
          sc5.style.display = 'flex';
          sc5.style.zIndex = '2';
          sc5.style.transform = `scale(${(0.65 + pC * 0.35).toFixed(2)})`;
          sc5.style.opacity = Math.min(1, pC * 1.5).toFixed(3);
          sc5.style.filter = `blur(${((1 - pC) * 8).toFixed(1)}px)`;
          sc5.style.clipPath = 'none';
          sc5.classList.add('active');
        }
      } else {
        if (sc5) resetScene(sc5);
      }
    }
    // -------------------------------------------------------------
    // NORMAL CALM SEGMENTS
    // -------------------------------------------------------------
    else if (time < 9.2) {
      showNormal(1);
    } else if (time < 21.2) {
      showNormal(2);
    } else if (time < 39.2) {
      showNormal(3);
    } else if (time < 49.2) {
      showNormal(4);
    } else {
      showNormal(5);
      if (time >= 58.5 && sc5) {
        const fade = Math.max(0, 1 - (time - 58.5) / 1.0);
        sc5.style.opacity = fade.toFixed(3);
      }
    }

    // Update scene pills
    document.querySelectorAll('.scene-pill').forEach(pill => {
      const targetScene = parseInt(pill.getAttribute('data-scene'));
      if (targetScene === this.currentSceneId) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });
  }

  // --- AMBIENT CYBER BACKGROUND ---
  renderAmbientBackground(ctx, w, h, time) {
    const cx = w * 0.5;
    const cy = h * 0.45;
    const sweepAngle = (time * 1.5) % (Math.PI * 2);

    ctx.save();
    // Radar concentric rings
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(w, h) * 0.42, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(w, h) * 0.25, 0, Math.PI * 2);
    ctx.stroke();

    // Radar scanning arm
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(sweepAngle) * Math.min(w, h) * 0.42, cy + Math.sin(sweepAngle) * Math.min(w, h) * 0.42);
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Floating particles
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ==========================================================================
  // 4 DIVERSE & CREATIVE SCI-FI TRANSITIONS (CANVAS LAYER OVERLAY)
  // ==========================================================================
  renderTransitions(ctx, w, h, time) {
    // -------------------------------------------------------------
    // VIDEO INTRO: Shutter Retract + Cyber Boot Sequence (0.0s - 1.8s)
    // -------------------------------------------------------------
    if (time >= 0.0 && time <= 1.8) {
      const p = time / 1.8; // 0 to 1
      ctx.save();

      // 1. Dark Shutter Doors Retracting (top and bottom curtain opening)
      const curtainH = (h / 2) * (1 - Math.pow(p, 2));
      if (curtainH > 0) {
        ctx.fillStyle = '#050914';
        ctx.fillRect(0, 0, w, curtainH);
        ctx.fillRect(0, h - curtainH, w, curtainH);

        // Glowing energy border on curtain edge
        ctx.strokeStyle = '#00f2fe';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.moveTo(0, curtainH); ctx.lineTo(w, curtainH);
        ctx.moveTo(0, h - curtainH); ctx.lineTo(w, h - curtainH);
        ctx.stroke();
      }

      // 2. Anamorphic horizontal lens flare streak & cyber crosshair in first 1.3s
      if (p < 0.75) {
        const flareAlpha = Math.sin((p / 0.75) * Math.PI);
        const grad = ctx.createLinearGradient(0, h * 0.5, w, h * 0.5);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        grad.addColorStop(0.3, `rgba(0, 242, 254, ${flareAlpha * 0.4})`);
        grad.addColorStop(0.5, `rgba(255, 255, 255, ${flareAlpha * 0.95})`);
        grad.addColorStop(0.7, `rgba(0, 255, 135, ${flareAlpha * 0.4})`);
        grad.addColorStop(1, 'rgba(0, 255, 135, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, h * 0.5 - 3, w, 6);

        // Cyber boot HUD text
        ctx.fillStyle = `rgba(255, 255, 255, ${flareAlpha * 0.95})`;
        ctx.font = 'bold 22px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚡ V-SHIELD DEFENSE ARCHITECTURE // BOOT SEQUENCE OK', w / 2, h * 0.5 - 24);
      }
      ctx.restore();
    }

    // -------------------------------------------------------------
    // TRANSITION 1: Scene 1 -> 2 (9.2s - 10.6s)
    // THEME: Cyber Glitch Matrix Break & Warning Shutter
    // -------------------------------------------------------------
    if (time >= 9.2 && time <= 10.6) {
      const p = (time - 9.2) / 1.4; // 0 to 1
      const intensity = Math.sin(p * Math.PI); // peak at 0.5 (9.9s)

      ctx.save();
      // Digital scanlines and chromatic displacement
      const barCount = 18;
      const barH = h / barCount;
      for (let i = 0; i < barCount; i++) {
        const offset = Math.sin(i * 77 + time * 45) * 160 * intensity;
        const col = (i % 2 === 0) ? `rgba(255, 42, 95, ${intensity * 0.85})` : `rgba(255, 183, 3, ${intensity * 0.75})`;
        ctx.fillStyle = col;
        ctx.fillRect((i % 2 === 0 ? offset : -offset), i * barH, w, barH * 0.75);
      }

      // Static noise sparks
      ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.9})`;
      ctx.lineWidth = 2;
      for (let j = 0; j < 12; j++) {
        const y = Math.random() * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // High-Tech Warning HUD Banner at peak
      if (intensity > 0.4) {
        ctx.fillStyle = 'rgba(10, 16, 28, 0.85)';
        ctx.fillRect(w * 0.1, h * 0.44, w * 0.8, 80);
        ctx.strokeStyle = '#ff2a5f';
        ctx.lineWidth = 3;
        ctx.strokeRect(w * 0.1, h * 0.44, w * 0.8, 80);

        ctx.fillStyle = '#ff2a5f';
        ctx.font = 'bold 32px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ SECURITY PROTOCOL SHIFT // TRADITIONAL RISKS IDENTIFIED', w / 2, h * 0.44 + 50);
      }
      ctx.restore();
    }

    // -------------------------------------------------------------
    // TRANSITION 2: Scene 2 -> 3 (21.2s - 22.6s)
    // THEME: High-Energy Cyan & Emerald Laser Blade Energy Slice
    // -------------------------------------------------------------
    if (time >= 21.2 && time <= 22.6) {
      const p = (time - 21.2) / 1.4; // 0 to 1
      ctx.save();

      // Laser blade aligns precisely with Scene 3 clip-path:
      // topX = p * 135%, botX = p * 135% - 28%
      const x1 = w * (p * 1.35);
      const y1 = 0;
      const x2 = w * (p * 1.35 - 0.28);
      const y2 = h;

      const flashAlpha = Math.sin(p * Math.PI);

      // Energy flash radial bloom
      const grad = ctx.createRadialGradient((x1 + x2) / 2, h / 2, 20, (x1 + x2) / 2, h / 2, w * 0.7);
      grad.addColorStop(0, `rgba(0, 255, 135, ${flashAlpha * 0.75})`);
      grad.addColorStop(0.3, `rgba(0, 242, 254, ${flashAlpha * 0.5})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 1. Emerald outer plasma glow
      ctx.strokeStyle = '#00ff87';
      ctx.lineWidth = 26;
      ctx.shadowColor = '#00ff87';
      ctx.shadowBlur = 45;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // 2. Cyan intense core ray
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 12;
      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // 3. Ultra-bright white cutting core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Cyber particles trailing behind blade
      for (let k = 0; k < 16; k++) {
        const trailX = (x1 + x2) / 2 - Math.random() * 260;
        const trailY = Math.random() * h;
        ctx.fillStyle = `rgba(0, 242, 254, ${flashAlpha * 0.85})`;
        ctx.fillRect(trailX, trailY, 6, 6);
      }

      // Laser Tag HUD
      if (flashAlpha > 0.4) {
        ctx.fillStyle = '#00ff87';
        ctx.font = 'bold 24px Orbitron, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('⚡ V-SHIELD AI ACTIVATION', Math.min(w - 40, x1 - 30), 80);
      }

      ctx.restore();
    }

    // -------------------------------------------------------------
    // TRANSITION 3: Scene 3 -> 4 (39.2s - 40.6s)
    // THEME: Biometric Iris Aperture Vault Shutter Portal
    // -------------------------------------------------------------
    if (time >= 39.2 && time <= 40.6) {
      const p = (time - 39.2) / 1.4; // 0 to 1
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.sqrt(cx * cx + cy * cy);
      const pinch = Math.sin(p * Math.PI); // 0 -> 1 -> 0

      ctx.save();
      const rot = p * Math.PI * 3;

      // Vault Door Shutter Blades (8 dark polygon blades closing in)
      if (pinch > 0.15) {
        ctx.fillStyle = `rgba(8, 14, 26, ${pinch * 0.95})`;
        for (let b = 0; b < 8; b++) {
          const bladeAngle = rot + (b / 8) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, maxRadius, bladeAngle, bladeAngle + (Math.PI / 4) * pinch);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Rotating Biometric Reticle Rings
      const currentR = maxRadius * (1 - pinch * 0.75);
      ctx.strokeStyle = `rgba(0, 255, 135, ${pinch * 0.95})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, currentR * 0.75, 0, Math.PI * 2);
      ctx.stroke();

      // Segmented ticks
      ctx.strokeStyle = `rgba(0, 242, 254, ${pinch * 0.85})`;
      ctx.lineWidth = 6;
      for (let s = 0; s < 12; s++) {
        const a = rot + (s / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx, cy, currentR * 0.8, a, a + 0.18);
        ctx.stroke();
      }

      // Center Biometric Target Lock Banner at seam (p ~ 0.5)
      if (pinch > 0.6) {
        ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
        ctx.fillRect(cx - 260, cy - 45, 520, 90);
        ctx.strokeStyle = '#00ff87';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 260, cy - 45, 520, 90);

        ctx.fillStyle = '#00ff87';
        ctx.font = 'bold 26px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BIOMETRIC ACCESS AUTHENTICATED', cx, cy - 5);
        ctx.fillStyle = '#00f2fe';
        ctx.font = '18px Rajdhani, sans-serif';
        ctx.fillText('ZONE 04: INTERNAL ACCESS PERMITTED', cx, cy + 25);
      }

      ctx.restore();
    }

    // -------------------------------------------------------------
    // TRANSITION 4: Scene 4 -> 5 (49.2s - 50.6s)
    // THEME: Quantum Warp Speed Hyperspace Stream & Supernova Burst
    // -------------------------------------------------------------
    if (time >= 49.2 && time <= 50.6) {
      const p = (time - 49.2) / 1.4; // 0 to 1
      const cx = w / 2;
      const cy = h / 2;
      const intensity = Math.sin(p * Math.PI);

      ctx.save();
      // Warp speed streaks radiating from center
      const streakCount = 80;
      for (let s = 0; s < streakCount; s++) {
        const angle = (s / streakCount) * Math.PI * 2 + (p * 0.8);
        const innerDist = 30 + p * 160;
        const outerDist = innerDist + 180 + p * 850;

        const x1 = cx + Math.cos(angle) * innerDist;
        const y1 = cy + Math.sin(angle) * innerDist;
        const x2 = cx + Math.cos(angle) * outerDist;
        const y2 = cy + Math.sin(angle) * outerDist;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, 'rgba(0, 242, 254, 0)');
        grad.addColorStop(0.5, `rgba(0, 242, 254, ${intensity * 0.95})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${intensity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 3 + (s % 3);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // Blinding Supernova Radiant Core at seam (p ~ 0.6 - 0.8)
      if (p >= 0.5 && p <= 0.85) {
        const flashP = Math.sin(((p - 0.5) / 0.35) * Math.PI);
        const coreGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.8);
        coreGrad.addColorStop(0, `rgba(255, 255, 255, ${flashP * 0.98})`);
        coreGrad.addColorStop(0.4, `rgba(0, 242, 254, ${flashP * 0.85})`);
        coreGrad.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Title HUD
      if (intensity > 0.45) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 32px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✦ INITIALIZING ASDS2501 FOUNDERS MATRIX ✦', cx, cy + 20);
      }

      ctx.restore();
    }

    // -------------------------------------------------------------
    // SCENE 5 FORMATION CONVERGENCE SHOCKWAVE (56.2s - 57.0s)
    // -------------------------------------------------------------
    if (time >= 56.2 && time <= 57.0) {
      const p = (time - 56.2) / 0.8;
      const shockR = p * (w * 0.6);
      const alpha = (1 - p);

      ctx.save();
      ctx.strokeStyle = `rgba(255, 183, 3, ${alpha * 0.85})`;
      ctx.lineWidth = 6;
      ctx.shadowColor = '#ffb703';
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.5, shockR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(0, 242, 254, ${alpha * 0.6})`;
      ctx.lineWidth = 14;
      ctx.stroke();
      ctx.restore();
    }

    // -------------------------------------------------------------
    // INK BLEED 1: Member 1 Watercolor Bloom Overlay (50.4s - 51.8s)
    // -------------------------------------------------------------
    if (time >= 50.4 && time <= 51.8) {
      const p = (time - 50.4) / 1.4;
      const photo1 = document.getElementById('photo-img-1');
      let cx = w * 0.32;
      let cy = h * 0.44;
      if (photo1) {
        const rect = photo1.getBoundingClientRect();
        if (rect.width > 0) {
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
      }

      const r = p * (w * 0.12);
      const alpha = Math.sin(p * Math.PI);
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(15, r));
      grad.addColorStop(0, `rgba(0, 242, 254, ${alpha * 0.5})`);
      grad.addColorStop(0.6, `rgba(56, 189, 248, ${alpha * 0.3})`);
      grad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(15, r), 0, Math.PI * 2);
      ctx.fill();

      // Ink droplets branching outward
      for (let d = 0; d < 14; d++) {
        const angle = (d / 14) * Math.PI * 2 + Math.sin(d * 17) * 0.6;
        const dist = r * (0.55 + Math.sin(d * 23) * 0.4);
        const dotX = cx + Math.cos(angle) * dist;
        const dotY = cy + Math.sin(angle) * dist;
        ctx.fillStyle = `rgba(0, 242, 254, ${alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3.5 + Math.sin(d * 7) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // -------------------------------------------------------------
    // INK BLEED 2: Member 2 Watercolor Bloom Overlay (53.4s - 54.8s)
    // -------------------------------------------------------------
    if (time >= 53.4 && time <= 54.8) {
      const p = (time - 53.4) / 1.4;
      const photo2 = document.getElementById('photo-img-2');
      let cx = w * 0.32;
      let cy = h * 0.44;
      if (photo2) {
        const rect = photo2.getBoundingClientRect();
        if (rect.width > 0) {
          cx = rect.left + rect.width / 2;
          cy = rect.top + rect.height / 2;
        }
      }

      const r = p * (w * 0.12);
      const alpha = Math.sin(p * Math.PI);
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, Math.max(15, r));
      grad.addColorStop(0, `rgba(0, 255, 135, ${alpha * 0.5})`);
      grad.addColorStop(0.6, `rgba(16, 185, 129, ${alpha * 0.3})`);
      grad.addColorStop(1, 'rgba(0, 255, 135, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(15, r), 0, Math.PI * 2);
      ctx.fill();

      for (let d = 0; d < 14; d++) {
        const angle = (d / 14) * Math.PI * 2 + Math.sin(d * 19) * 0.6;
        const dist = r * (0.55 + Math.sin(d * 29) * 0.4);
        const dotX = cx + Math.cos(angle) * dist;
        const dotY = cy + Math.sin(angle) * dist;
        ctx.fillStyle = `rgba(0, 255, 135, ${alpha * 0.75})`;
        ctx.beginPath();
        ctx.arc(dotX, dotY, 3.5 + Math.sin(d * 11) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // -------------------------------------------------------------
    // VIDEO OUTRO: Holographic Shutdown & Cinematic Fade (58.2s - 60.0s)
    // -------------------------------------------------------------
    if (time >= 58.2 && time <= 60.0) {
      const p = (time - 58.2) / 1.8; // 0 to 1
      ctx.save();

      // Screen collapse / Quantum shutdown beam (58.2 - 59.5s)
      if (p < 0.75) {
        const collapseP = p / 0.75;
        const vH = (h / 2) * collapseP;
        ctx.fillStyle = '#030712';
        ctx.fillRect(0, 0, w, vH);
        ctx.fillRect(0, h - vH, w, vH);

        // Glowing horizon beam
        ctx.strokeStyle = '#ffb703';
        ctx.lineWidth = 4 * (1 - collapseP);
        ctx.shadowColor = '#00f2fe';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(0, vH); ctx.lineTo(w, vH);
        ctx.moveTo(0, h - vH); ctx.lineTo(w, h - vH);
        ctx.stroke();

        // Finale Badge Overlay with Cyber Backdrop
        const textAlpha = Math.sin(collapseP * Math.PI);
        ctx.fillStyle = `rgba(5, 10, 20, ${textAlpha * 0.9})`;
        ctx.fillRect(w * 0.12, h * 0.5 - 50, w * 0.76, 100);
        ctx.strokeStyle = `rgba(0, 242, 254, ${textAlpha * 0.85})`;
        ctx.lineWidth = 2;
        ctx.strokeRect(w * 0.12, h * 0.5 - 50, w * 0.76, 100);

        ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha * 0.98})`;
        ctx.font = 'bold 28px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✦ V-SHIELD • AN NINH VỮNG CHẮC • ASDS2501 ✦', w / 2, h * 0.5 + 9);
      } else {
        // Solid clean fade to black at very end (59.5 - 60.0s)
        const fadeP = (p - 0.75) / 0.25;
        ctx.fillStyle = `rgba(3, 7, 18, ${Math.min(1, fadeP * 1.5)})`;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();
    }
  }

  // --- Sound SFX exact triggers ---
  checkSoundCues(time) {
    const sec = Math.floor(time * 10) / 10;
    if (Math.abs(sec - this.lastTriggeredSecond) < 0.2) return;

    if (window.audioManager) {
      if (Math.abs(sec - 16.5) < 0.15) {
        window.audioManager.playAlarm();
        this.lastTriggeredSecond = sec;
      } else if (Math.abs(sec - 24.5) < 0.15) {
        window.audioManager.playScan();
        this.lastTriggeredSecond = sec;
      } else if (Math.abs(sec - 26.5) < 0.15) {
        window.audioManager.playSuccess();
        window.audioManager.playBarrier();
        this.lastTriggeredSecond = sec;
      } else if (Math.abs(sec - 42.0) < 0.15) {
        window.audioManager.playSuccess();
        this.lastTriggeredSecond = sec;
      } else if (Math.abs(sec - 46.5) < 0.15) {
        window.audioManager.playAlarm();
        this.lastTriggeredSecond = sec;
      }
    }
  }

  // --- Granular animations per scene ---
  animateScene(sceneId, time) {
    switch (sceneId) {
      case 1: this.animateScene1(time); break;
      case 2: this.animateScene2(time); break;
      case 3: this.animateScene3(time); break;
      case 4: this.animateScene4(time); break;
      case 5: this.animateScene5(time); break;
    }
  }

  animateScene1(time) {
    const zones = document.querySelectorAll('.enterprise-zones-grid .zone-card');
    if (time >= 3.5) {
      const activeIdx = Math.floor((time - 3.5) * 1.2) % zones.length;
      zones.forEach((z, i) => {
        if (i === activeIdx) z.classList.add('pulse');
        else z.classList.remove('pulse');
      });
    } else {
      zones.forEach(z => z.classList.remove('pulse'));
    }
  }

  animateScene2(time) {
    const relTime = time - 10.0;
    const carQueue = document.getElementById('svg-car-queue');
    const intruder = document.getElementById('svg-intruder');
    const warningStamp = document.querySelector('.warning-breach-stamp');

    if (carQueue) {
      const jitter = Math.sin(time * 8) * 1.5;
      carQueue.setAttribute('transform', `translate(0, ${jitter})`);
    }

    if (intruder) {
      if (relTime >= 4.5) {
        const progress = Math.min(1, (relTime - 4.5) / 4.0);
        const posX = 40 + progress * 140;
        intruder.setAttribute('transform', `translate(${posX}, 0)`);
      } else {
        intruder.setAttribute('transform', `translate(40, 0)`);
      }
    }

    if (warningStamp) {
      if (relTime >= 5.5) {
        warningStamp.style.opacity = '1';
        warningStamp.style.transform = `rotate(-5deg) scale(${1 + Math.sin(time * 6) * 0.04})`;
      } else {
        warningStamp.style.opacity = '0';
      }
    }
  }

  animateScene3(time) {
    const relTime = time - 22.0;
    const smartCar = document.getElementById('svg-smart-car');
    const barrierArm = document.getElementById('svg-barrier-arm');
    const laserBeam = document.getElementById('svg-laser-beam');
    const faceTarget = document.getElementById('svg-face-target');
    const plateTarget = document.getElementById('svg-plate-target');
    const hudStatusVal = document.getElementById('hud-status-val');

    if (relTime < 3.0) {
      const carProgress = Math.min(1, relTime / 3.0);
      const posX = -120 + carProgress * 150;
      if (smartCar) smartCar.setAttribute('transform', `translate(${posX}, 0)`);
      if (barrierArm) barrierArm.setAttribute('transform', `rotate(0, 361, 128)`);
      if (laserBeam) laserBeam.style.opacity = '0';
      if (faceTarget) faceTarget.style.opacity = '0';
      if (plateTarget) plateTarget.style.opacity = '0';
      if (hudStatusVal) hudStatusVal.textContent = 'ĐANG ĐỢI XE TIẾP CẬN...';
    } else if (relTime >= 3.0 && relTime < 6.0) {
      if (smartCar) smartCar.setAttribute('transform', `translate(30, 0)`);
      if (barrierArm) barrierArm.setAttribute('transform', `rotate(0, 361, 128)`);
      if (laserBeam) {
        laserBeam.style.opacity = '1';
        const laserY = 80 + Math.sin(time * 12) * 50;
        laserBeam.setAttribute('y1', laserY);
        laserBeam.setAttribute('y2', laserY);
      }
      if (faceTarget) faceTarget.style.opacity = '1';
      if (plateTarget) plateTarget.style.opacity = '1';
      if (hudStatusVal) hudStatusVal.textContent = 'AI ĐANG NHẬN DIỆN... (0.18s)';
    } else if (relTime >= 6.0 && relTime < 12.0) {
      if (laserBeam) laserBeam.style.opacity = '0';
      if (faceTarget) faceTarget.style.opacity = '0';
      if (plateTarget) plateTarget.style.opacity = '0';

      const openProgress = Math.min(1, (relTime - 6.0) / 0.8);
      const angle = -75 * openProgress;
      if (barrierArm) barrierArm.setAttribute('transform', `rotate(${angle}, 361, 128)`);

      const driveProgress = Math.min(1, (relTime - 6.8) / 3.0);
      const posX = 30 + (driveProgress > 0 ? driveProgress * 280 : 0);
      if (smartCar) smartCar.setAttribute('transform', `translate(${posX}, 0)`);

      if (hudStatusVal) {
        hudStatusVal.textContent = 'HỢP LỆ - CỔNG MỞ - ĐÃ LƯU CLOUD';
        hudStatusVal.style.color = 'var(--green)';
      }
    } else {
      if (barrierArm) barrierArm.setAttribute('transform', `rotate(0, 361, 128)`);
      if (smartCar) smartCar.setAttribute('transform', `translate(310, 0)`);
      if (hudStatusVal) hudStatusVal.textContent = 'SẴN SÀNG ĐÓN LƯỢT TIẾP THEO';
    }
  }

  animateScene4(time) {
    const relTime = time - 40.0;
    const doorLeft = document.getElementById('svg-door-left');
    const doorRight = document.getElementById('svg-door-right');
    const staffPerson = document.getElementById('svg-staff-person');
    const deniedIntruder = document.getElementById('svg-denied-person');
    const deniedAlertBox = document.getElementById('denied-alert-indicator');

    if (relTime < 5.0) {
      if (staffPerson) {
        const pProgress = Math.min(1, relTime / 3.0);
        staffPerson.setAttribute('transform', `translate(${pProgress * 60}, 0)`);
      }
      if (deniedIntruder) deniedIntruder.setAttribute('transform', `translate(0, 0)`);
      if (deniedAlertBox) deniedAlertBox.style.opacity = '0';

      if (relTime >= 2.0 && relTime < 4.5) {
        const slideProgress = Math.min(1, (relTime - 2.0) / 1.0);
        if (doorLeft) doorLeft.setAttribute('transform', `translate(${-slideProgress * 30}, 0)`);
        if (doorRight) doorRight.setAttribute('transform', `translate(${slideProgress * 30}, 0)`);
      } else if (relTime >= 4.5) {
        if (doorLeft) doorLeft.setAttribute('transform', `translate(0, 0)`);
        if (doorRight) doorRight.setAttribute('transform', `translate(0, 0)`);
      }
    } else {
      if (staffPerson) staffPerson.setAttribute('transform', `translate(60, 0)`);
      if (doorLeft) doorLeft.setAttribute('transform', `translate(0, 0)`);
      if (doorRight) doorRight.setAttribute('transform', `translate(0, 0)`);

      if (deniedIntruder) {
        const pProgress = Math.min(1, (relTime - 5.0) / 2.0);
        deniedIntruder.setAttribute('transform', `translate(${pProgress * 50}, 0)`);
      }

      if (deniedAlertBox && relTime >= 6.5) {
        deniedAlertBox.style.opacity = (Math.sin(time * 10) > 0) ? '1' : '0.3';
      }
    }
  }

  // ==========================================================================
  // SCENE 5: 3 GIAI ĐOẠN ĐẶC SẮC (Thành 50-53s -> Hoài Anh 53-56s -> Hội tụ 56-60s)
  // ==========================================================================
  animateScene5(time) {
    const relTime = time - 50.0;
    const scene5El = document.getElementById('scene-5');
    const card1 = document.getElementById('card-member-1');
    const card2 = document.getElementById('card-member-2');
    const photo1 = document.getElementById('photo-img-1');
    const photo2 = document.getElementById('photo-img-2');
    const titleEl = document.getElementById('scene-5-title');
    const descEl = document.getElementById('scene-5-desc');
    const subBadge = document.getElementById('team-sub-badge');
    const ctaBox = document.getElementById('scene-5-cta');
    const headerEl = document.getElementById('scene-5-header');

    if (!scene5El || !card1 || !card2) return;

    // --- PHASE 1 (50.0s - 53.0s): SPOTLIGHT 1 - PHẠM VĂN THÀNH ---
    if (relTime < 3.0) {
      scene5El.className = 'scene active state-member-1';
      if (subBadge) {
        subBadge.textContent = 'BAN SÁNG LẬP • NHÀ PHÁT TRIỂN 01';
        subBadge.className = 'team-sub-badge badge-blue';
      }
      if (titleEl) titleEl.textContent = 'TRƯỞNG NHÓM PHÁT TRIỂN & KỸ SƯ AI';
      if (descEl) descEl.textContent = 'PHẠM VĂN THÀNH (RAIDEN SHUGA) – MSSV: PI00336';
      if (ctaBox) {
        ctaBox.style.opacity = '0';
        ctaBox.style.transform = 'translateY(40px)';
      }

      card2.style.display = 'none';

      // 1. Photo Ink Bleed Animation ("loang mực thành tranh" 50.4s - 51.8s)
      if (photo1) {
        const inkP = Math.max(0, Math.min(1, (relTime - 0.4) / 1.4));
        if (inkP <= 0) {
          photo1.style.clipPath = 'circle(0% at 50% 45%)';
          photo1.style.filter = 'grayscale(100%) contrast(300%) brightness(0.4) blur(8px)';
        } else if (inkP < 1) {
          const radius = (inkP * 140).toFixed(1);
          const gray = ((1 - inkP) * 100).toFixed(0);
          const contrast = (100 + (1 - inkP) * 200).toFixed(0);
          const bright = (1 - (1 - inkP) * 0.5).toFixed(2);
          const blurPx = ((1 - inkP) * 6).toFixed(1);
          photo1.style.clipPath = `circle(${radius}% at 50% 45%)`;
          photo1.style.filter = `grayscale(${gray}%) contrast(${contrast}%) brightness(${bright}) blur(${blurPx}px)`;
        } else {
          photo1.style.clipPath = 'none';
          photo1.style.filter = 'none';
        }
      }

      // 2. Card 1 Dramatic Entrance (50.0 - 50.6s)
      if (relTime < 0.6) {
        const e = relTime / 0.6;
        card1.style.display = 'flex';
        card1.style.transform = `translateX(-50%) translateY(${(-(1 - e) * 80).toFixed(1)}px) scale(${(1.3 - e * 0.25).toFixed(2)})`;
        card1.style.opacity = Math.min(1, e * 1.5).toFixed(3);
        card1.style.filter = `drop-shadow(0 0 ${(30 + (1 - e) * 50).toFixed(0)}px #00f2fe) brightness(${(1.5 - e * 0.5).toFixed(2)})`;
      }
      // 3. Steady Spotlight Center Hover (50.6 - 52.2s)
      else if (relTime < 2.2) {
        const hoverY = Math.sin(time * 3) * 5;
        card1.style.display = 'flex';
        card1.style.transform = `translateX(-50%) translateY(${hoverY.toFixed(1)}px) scale(1.05)`;
        card1.style.opacity = '1';
        card1.style.filter = 'drop-shadow(0 0 35px rgba(0, 242, 254, 0.55)) brightness(1)';
      }
      // 4. Dramatic Off-Screen Exit to Left (52.2 - 53.0s: thẻ bay hẳn ra ngoài nhường chỗ)
      else {
        const x = (relTime - 2.2) / 0.8; // 0 to 1
        const exitX = -(50 + Math.pow(x, 1.4) * 160); // from -50% to -210%!
        const exitRot = -x * 24;
        const exitScale = 1.05 - x * 0.35;
        card1.style.display = 'flex';
        card1.style.transform = `translateX(${exitX.toFixed(1)}%) translateY(${(x * 40).toFixed(1)}px) rotate(${exitRot.toFixed(1)}deg) scale(${exitScale.toFixed(2)})`;
        card1.style.opacity = Math.max(0, 1 - x * 1.8).toFixed(3);
        card1.style.filter = `blur(${(x * 12).toFixed(1)}px)`;
      }
    }
    // --- PHASE 2 (53.0s - 56.0s): SPOTLIGHT 2 - PHẠM NGỌC HOÀI ANH ---
    else if (relTime >= 3.0 && relTime < 6.0) {
      const phase2Rel = relTime - 3.0; // 0 to 3.0
      scene5El.className = 'scene active state-member-2';
      if (subBadge) {
        subBadge.textContent = 'BAN SÁNG LẬP • NHÀ PHÁT TRIỂN 02';
        subBadge.className = 'team-sub-badge badge-green';
      }
      if (titleEl) titleEl.textContent = 'TRƯỞNG NHÓM GIAO DIỆN & DEVOPS';
      if (descEl) descEl.textContent = 'PHẠM NGỌC HOÀI ANH (CHÚA TỂ VOUCHER) – MSSV: PI01945';
      if (ctaBox) {
        ctaBox.style.opacity = '0';
        ctaBox.style.transform = 'translateY(40px)';
      }

      card1.style.display = 'none';

      // 1. Photo Ink Bleed Animation ("loang mực thành tranh" 53.4s - 54.8s)
      if (photo2) {
        const inkP = Math.max(0, Math.min(1, (phase2Rel - 0.4) / 1.4));
        if (inkP <= 0) {
          photo2.style.clipPath = 'circle(0% at 50% 45%)';
          photo2.style.filter = 'grayscale(100%) contrast(300%) brightness(0.4) blur(8px)';
        } else if (inkP < 1) {
          const radius = (inkP * 140).toFixed(1);
          const gray = ((1 - inkP) * 100).toFixed(0);
          const contrast = (100 + (1 - inkP) * 200).toFixed(0);
          const bright = (1 - (1 - inkP) * 0.5).toFixed(2);
          const blurPx = ((1 - inkP) * 6).toFixed(1);
          photo2.style.clipPath = `circle(${radius}% at 50% 45%)`;
          photo2.style.filter = `grayscale(${gray}%) contrast(${contrast}%) brightness(${bright}) blur(${blurPx}px)`;
        } else {
          photo2.style.clipPath = 'none';
          photo2.style.filter = 'none';
        }
      }

      // 2. Rocket Slide-in from Right (53.0 - 53.6s)
      if (phase2Rel < 0.6) {
        const e = phase2Rel / 0.6;
        const slideX = (1 - e) * 160 - 50; // starts at +110%, lands at -50%
        card2.style.display = 'flex';
        card2.style.transform = `translateX(${slideX.toFixed(1)}%) scale(${(1.3 - e * 0.25).toFixed(2)})`;
        card2.style.opacity = Math.min(1, e * 1.5).toFixed(3);
        card2.style.filter = `drop-shadow(0 0 ${(30 + (1 - e) * 50).toFixed(0)}px #00ff87) brightness(${(1.5 - e * 0.5).toFixed(2)})`;
      }
      // 3. Steady Spotlight Hover (53.6 - 55.3s)
      else if (phase2Rel < 2.3) {
        const hoverY = Math.sin(time * 3 + 1) * 5;
        card2.style.display = 'flex';
        card2.style.transform = `translateX(-50%) translateY(${hoverY.toFixed(1)}px) scale(1.05)`;
        card2.style.opacity = '1';
        card2.style.filter = 'drop-shadow(0 0 35px rgba(0, 255, 135, 0.55)) brightness(1)';
      }
      // 4. Slide preparing for formation (55.3 - 56.0s)
      else {
        const x = (phase2Rel - 2.3) / 0.7;
        card2.style.display = 'flex';
        card2.style.transform = `translateX(${(-50 + x * 20).toFixed(1)}%) scale(${(1.05 - x * 0.05).toFixed(2)})`;
        card2.style.opacity = '1';
        card2.style.filter = 'drop-shadow(0 0 30px rgba(0, 255, 135, 0.45))';
      }
    }
    // --- PHASE 3 (56.0s - 60.0s): HỘI TỤ ĐỘI HÌNH ASDS2501 ---
    else {
      const phase3Rel = relTime - 6.0; // 0 to 4.0
      scene5El.className = 'scene active state-formation';
      if (subBadge) {
        subBadge.textContent = '✦ ĐỘI HÌNH ĐOÀN KẾT VỮNG MẠNH ✦';
        subBadge.className = 'team-sub-badge badge-gold';
      }
      if (titleEl) titleEl.innerHTML = 'ĐỘI NGŨ SÁNG LẬP – <span class="highlight-asds">NHÓM DỰ ÁN ASDS2501</span>';
      if (descEl) descEl.textContent = 'V-SHIELD – KIẾN TẠO CHUẨN MỰC AN NINH THÔNG MINH CHO DOANH NGHIỆP';

      if (photo1) { photo1.style.clipPath = 'none'; photo1.style.filter = 'none'; }
      if (photo2) { photo2.style.clipPath = 'none'; photo2.style.filter = 'none'; }

      card1.style.display = 'flex';
      card2.style.display = 'flex';

      // Kinetic Convergence Impact (56.0 - 56.8s)
      if (phase3Rel < 0.8) {
        const c = phase3Rel / 0.8;
        card1.style.transform = `translateX(${(-(1 - c) * 60).toFixed(1)}%)`;
        card1.style.opacity = Math.min(1, c * 1.5).toFixed(3);
        card1.style.filter = `drop-shadow(0 0 ${(15 + c * 20).toFixed(0)}px #00f2fe)`;

        card2.style.transform = `translateX(${((1 - c) * 60).toFixed(1)}%)`;
        card2.style.opacity = Math.min(1, c * 1.5).toFixed(3);
        card2.style.filter = `drop-shadow(0 0 ${(15 + c * 20).toFixed(0)}px #00ff87)`;

        if (headerEl) {
          headerEl.style.transform = `translateY(${(-(1 - c) * 35).toFixed(1)}px)`;
          headerEl.style.opacity = c.toFixed(3);
        }
      } else {
        card1.style.transform = 'none';
        card1.style.opacity = '1';
        card1.style.filter = 'drop-shadow(0 0 25px rgba(0, 242, 254, 0.45))';

        card2.style.transform = 'none';
        card2.style.opacity = '1';
        card2.style.filter = 'drop-shadow(0 0 25px rgba(0, 255, 135, 0.45))';

        if (headerEl) {
          headerEl.style.transform = 'none';
          headerEl.style.opacity = '1';
        }
      }

      // CTA Box Slide up and glow
      if (ctaBox) {
        const ctaProgress = Math.min(1, Math.max(0, (phase3Rel - 0.3) / 0.6));
        ctaBox.style.opacity = ctaProgress.toFixed(3);
        ctaBox.style.transform = `translateY(${((1 - ctaProgress) * 30).toFixed(1)}px)`;
        ctaBox.style.boxShadow = `0 0 ${(18 + Math.sin(time * 8) * 8).toFixed(0)}px var(--cyan)`;
      }
    }
  }
}

window.sceneManager = new SceneManager();
