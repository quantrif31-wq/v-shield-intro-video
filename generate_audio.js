// ==========================================================================
// V-SHIELD AUDIO SYNTHESIZER FOR MP4 VIDEO
// Generates a 60-second high-tech synthwave audio track (WAV 44.1kHz Stereo)
// ==========================================================================

const fs = require('fs');

function generateWav(filename, durationSeconds = 60) {
  const sampleRate = 44100;
  const numChannels = 2;
  const bitsPerSample = 16;
  const totalSamples = sampleRate * durationSeconds;
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = totalSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Chunk Descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' Sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 = PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // 'data' Sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Note Frequencies in Hz
  const bassNotes = [65.41, 65.41, 77.78, 65.41, 98.00, 65.41, 87.31, 65.41]; // C2, Eb2, G2, F2
  const leadNotes = [261.63, 311.13, 392.00, 466.16, 523.25, 392.00, 311.13, 261.63];

  const bpm = 124;
  const stepDuration = (60 / bpm) / 4; // 16th note (~0.12s)

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;

    // 1. Music Step
    const currentStep = Math.floor(t / stepDuration);
    const stepT = (t % stepDuration) / stepDuration;

    // Bassline (sawtooth/square simulation)
    const bassFreq = bassNotes[currentStep % bassNotes.length];
    let bass = ((t * bassFreq * 2) % 2 - 1) * Math.exp(-stepT * 3.5);

    // Lead Arp (sine wave)
    let lead = 0;
    if (currentStep % 2 === 0) {
      const leadFreq = leadNotes[Math.floor(currentStep / 2) % leadNotes.length];
      lead = Math.sin(2 * Math.PI * leadFreq * t) * Math.exp(-stepT * 2.0);
    }

    // Hi-hat tick
    let hihat = 0;
    if (currentStep % 2 === 1) {
      hihat = (Math.random() * 2 - 1) * Math.exp(-stepT * 12.0);
    }

    // Ambient Drone Pad (soft slow chord)
    const drone = Math.sin(2 * Math.PI * 130.81 * t) * 0.15 + Math.sin(2 * Math.PI * 196.00 * t) * 0.1;

    // 2. Sound Effects Cues (SFX)
    let sfx = 0;

    // Scene Transition Whooshes at 0s, 10s, 22s, 40s, 50s
    [0.1, 10.0, 22.0, 40.0, 50.0].forEach(wt => {
      if (t >= wt && t < wt + 0.5) {
        const wtRel = (t - wt) / 0.5;
        const env = Math.sin(wtRel * Math.PI);
        const noise = (Math.random() * 2 - 1);
        sfx += noise * env * 0.35;
      }
    });

    // Warning Buzzer at 16.5s and 46.5s
    [16.5, 46.5].forEach(at => {
      if ((t >= at && t < at + 0.12) || (t >= at + 0.16 && t < at + 0.28)) {
        const freq = 150;
        sfx += ((t * freq * 2) % 2 - 1) * 0.4;
      }
    });

    // AI Laser Scan at 24.5s
    if (t >= 24.5 && t < 24.8) {
      const stRel = (t - 24.5) / 0.3;
      const scanFreq = 800 + stRel * 1600;
      sfx += Math.sin(2 * Math.PI * scanFreq * t) * (1 - stRel) * 0.35;
    }

    // Success Chime at 26.5s and 42.0s
    [26.5, 42.0].forEach(ct => {
      if (t >= ct && t < ct + 0.4) {
        const ctRel = (t - ct) / 0.4;
        sfx += (Math.sin(2 * Math.PI * 587.33 * t) * Math.exp(-ctRel * 4) +
                Math.sin(2 * Math.PI * 880.00 * t) * Math.exp(-ctRel * 3)) * 0.3;
      }
    });

    // Master Mix
    let mix = (bass * 0.25 + lead * 0.2 + hihat * 0.08 + drone + sfx * 0.55);

    // Fade in at 0-1s, fade out at 58-60s
    if (t < 1.0) mix *= t;
    if (t > 58.0) mix *= (60.0 - t) / 2.0;

    // Clamp to [-1, 1]
    mix = Math.max(-1, Math.min(1, mix));

    // Convert to 16-bit PCM integer
    const sampleVal = Math.floor(mix * 32767);

    // Write Stereo (Left & Right)
    buffer.writeInt16LE(sampleVal, offset);
    buffer.writeInt16LE(sampleVal, offset + 2);
    offset += 4;
  }

  fs.writeFileSync(filename, buffer);
  console.log(`Saved audio track: ${filename} (${buffer.length} bytes)`);
}

generateWav('audio.wav', 60);
