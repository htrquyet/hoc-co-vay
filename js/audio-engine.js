(function (root) {
  'use strict';

  const MUSIC_TRACKS = [
    {
      id: 'koto-zen',
      name: 'Đàn Tranh Thiền',
      desc: 'Giai điệu ngũ cung chậm rãi, ấm áp'
    },
    {
      id: 'wind-chime',
      name: 'Chuông Gió Đạo Trường',
      desc: 'Hòa âm nhẹ nhàng kết hợp chuông Furin trầm ấm'
    },
    {
      id: 'rain-dojo',
      name: 'Mưa Rơi Mái Hiên',
      desc: 'Tiếng mưa ấm dịu, hoàn toàn không chói gắt'
    }
  ];

  // Natural acoustic profiles matched to Goban skins (low-Q, warm, non-whistling)
  const ACOUSTIC_PROFILES = {
    'wood-warm': { lowFreq: 185, midFreq: 520, clickFreq: 2150, lowpass: 4100, decay: 0.04, q: 0.9 },
    'wood-deep': { lowFreq: 150, midFreq: 430, clickFreq: 1800, lowpass: 3500, decay: 0.046, q: 0.85 },
    'wood-crisp': { lowFreq: 215, midFreq: 610, clickFreq: 2450, lowpass: 4500, decay: 0.034, q: 0.95 },
    'stone-jade': { lowFreq: 245, midFreq: 740, clickFreq: 2650, lowpass: 4700, decay: 0.042, q: 1.15 },
    'stone-marble': { lowFreq: 265, midFreq: 790, clickFreq: 2800, lowpass: 4900, decay: 0.038, q: 1.2 },
    'ceramic-soft': { lowFreq: 195, midFreq: 560, clickFreq: 2100, lowpass: 3900, decay: 0.038, q: 0.9 }
  };

  // Peaceful warm pentatonic frequencies (D4 - A5)
  const KOTO_NOTES = [293.66, 329.63, 392.0, 440.0, 493.88, 587.33, 659.25];
  const CHIME_NOTES = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99];

  class GoAudioEngine {
    constructor(options = {}) {
      this.sfxEnabled = options.sfxEnabled !== false;
      this.sfxVolume = typeof options.sfxVolume === 'number' ? options.sfxVolume : 0.8;
      this.musicEnabled = Boolean(options.musicEnabled);
      this.musicTrack = options.musicTrack || 'koto-zen';
      this.musicVolume = typeof options.musicVolume === 'number' ? options.musicVolume : 0.45;
      this.rainEnabled = Boolean(options.rainEnabled);
      this.acousticProfile = options.acousticProfile || 'wood-warm';

      this.ctx = null;
      this._sfxMaster = null;
      this._sfxRoom = null;
      this._musicMaster = null;
      this._rainMaster = null;
      this._reverb = null;
      this._rainBuffer = null;

      this._musicTimer = null;
      this._rainPatterTimer = null;
      this._padNodes = [];
      this._rainNodes = null;
      this._unlocked = false;
      this._disposed = false;
    }

    _getAudioContextCtor() {
      if (typeof window === 'undefined') return null;
      return window.AudioContext || window.webkitAudioContext || null;
    }

    _ensureContext(fromGesture = false) {
      if (this._disposed) return null;
      const Ctor = this._getAudioContextCtor();
      if (!Ctor) return null;

      if (!this.ctx) {
        this.ctx = new Ctor();

        this._sfxMaster = this.ctx.createGain();
        this._sfxMaster.gain.value = this.sfxEnabled ? this.sfxVolume : 0;
        this._sfxMaster.connect(this.ctx.destination);

        // Short warm wooden-room early reflection for realistic Goban acoustics
        this._sfxRoom = this._createReverb(this.ctx, 0.36, 4.2, 0.25);
        const sfxRoomGain = this.ctx.createGain();
        sfxRoomGain.gain.value = 0.18;
        this._sfxRoom.connect(sfxRoomGain);
        sfxRoomGain.connect(this._sfxMaster);

        this._musicMaster = this.ctx.createGain();
        this._musicMaster.gain.value = 0;
        this._musicMaster.connect(this.ctx.destination);

        this._rainMaster = this.ctx.createGain();
        this._rainMaster.gain.value = 0;
        this._rainMaster.connect(this.ctx.destination);

        this._reverb = this._createReverb(this.ctx, 2.5, 3.0, 0.45);
        this._reverb.connect(this._musicMaster);

        this._rainBuffer = this._createSeamlessRainBuffer(this.ctx, 10.0, 0.8);
      }

      if (fromGesture) {
        this._unlocked = true;
      }

      if (this.ctx.state === 'suspended' && (fromGesture || this._unlocked)) {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    }

    _createReverb(ctx, seconds = 2.4, decay = 2.8, amp = 0.45) {
      const rate = ctx.sampleRate;
      const length = Math.max(1, Math.floor(rate * seconds));
      const impulse = ctx.createBuffer(2, length, rate);
      for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        let lp = 0;
        for (let i = 0; i < length; i++) {
          const env = Math.pow(1 - i / length, decay);
          const white = Math.random() * 2 - 1;
          lp = lp * 0.78 + white * 0.22; // mellow darkened room tail
          data[i] = lp * env * amp;
        }
      }
      const convolver = ctx.createConvolver();
      convolver.buffer = impulse;
      return convolver;
    }

    /**
     * Generates a seamless stereo warm brown-pink rain noise buffer with cosine
     * crossfading at the loop boundary so there are zero clicks or cyclic seams.
     */
    _createSeamlessRainBuffer(ctx, seconds = 10.0, crossfadeSec = 0.8) {
      const rate = ctx.sampleRate;
      const len = Math.max(2, Math.floor(rate * seconds));
      const fadeSamples = Math.min(Math.floor(len / 3), Math.floor(rate * crossfadeSec));
      const totalRaw = len + fadeSamples;
      const buf = ctx.createBuffer(2, len, rate);

      for (let ch = 0; ch < 2; ch++) {
        const raw = new Float32Array(totalRaw);
        let b0 = 0;
        let b1 = 0;
        let b2 = 0;
        let b3 = 0;
        let b4 = 0;
        let b5 = 0;
        let brown = 0;

        for (let i = 0; i < totalRaw; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const pink = (b0 + b1 + b2 + b3 + b4 + b5 + white * 0.5362) * 0.045;
          brown = (brown + 0.024 * white) / 1.024;
          // Warm blend: mostly brown warmth + gentle pink texture
          raw[i] = brown * 0.72 + pink * 0.28;
        }

        const out = buf.getChannelData(ch);
        for (let i = 0; i < len; i++) {
          out[i] = raw[i];
        }
        // Equal-power cosine crossfade of tail [len .. len + fadeSamples) into start [0 .. fadeSamples)
        for (let i = 0; i < fadeSamples; i++) {
          const t = i / fadeSamples;
          const fadeIn = Math.sin(t * Math.PI * 0.5);
          const fadeOut = Math.cos(t * Math.PI * 0.5);
          out[i] = raw[i] * fadeIn + raw[len + i] * fadeOut;
        }
      }
      return buf;
    }

    _connectWithPan(node, destination, panValue = 0) {
      if (this.ctx && typeof this.ctx.createStereoPanner === 'function') {
        const panner = this.ctx.createStereoPanner();
        panner.pan.value = Math.max(-1, Math.min(1, panValue));
        node.connect(panner);
        panner.connect(destination);
      } else {
        node.connect(destination);
      }
    }

    unlock() {
      const ctx = this._ensureContext(true);
      if (!ctx) return;
      if (this.musicEnabled && !this._musicTimer) {
        this._startMusicEngine();
      }
      if ((this.rainEnabled || (this.musicEnabled && this.musicTrack === 'rain-dojo')) && !this._rainNodes) {
        this._syncRainNode();
      }
    }

    setAcousticProfile(profile) {
      if (ACOUSTIC_PROFILES[profile]) {
        this.acousticProfile = profile;
      }
    }

    setSfxEnabled(flag) {
      this.sfxEnabled = Boolean(flag);
      if (this._sfxMaster && this.ctx) {
        this._sfxMaster.gain.setTargetAtTime(
          this.sfxEnabled ? this.sfxVolume : 0,
          this.ctx.currentTime,
          0.03
        );
      }
    }

    setSfxVolume(vol) {
      this.sfxVolume = Math.max(0, Math.min(1, Number(vol) || 0));
      if (this._sfxMaster && this.ctx) {
        this._sfxMaster.gain.setTargetAtTime(
          this.sfxEnabled ? this.sfxVolume : 0,
          this.ctx.currentTime,
          0.03
        );
      }
    }

    setMusicEnabled(flag, fromGesture = true) {
      this.musicEnabled = Boolean(flag);
      if (this.musicEnabled) {
        const ctx = this._ensureContext(fromGesture);
        if (ctx && (fromGesture || this._unlocked)) {
          this._startMusicEngine();
        }
      } else {
        this._stopMusicEngine();
      }
      this._syncRainNode();
    }

    setMusicTrack(trackId) {
      if (!MUSIC_TRACKS.some((t) => t.id === trackId)) return;
      const changed = this.musicTrack !== trackId;
      this.musicTrack = trackId;
      if (this.musicEnabled && changed && (this._unlocked || this.ctx)) {
        this._stopMusicEngine();
        this._startMusicEngine();
      }
      this._syncRainNode();
    }

    setMusicVolume(vol) {
      this.musicVolume = Math.max(0, Math.min(1, Number(vol) || 0));
      if (this._musicMaster && this.ctx && this.musicEnabled) {
        this._musicMaster.gain.setTargetAtTime(
          this.musicVolume * 0.58,
          this.ctx.currentTime,
          0.08
        );
      }
      this._syncRainNode();
    }

    setRainEnabled(flag, fromGesture = true) {
      this.rainEnabled = Boolean(flag);
      if (this.rainEnabled) {
        this._ensureContext(fromGesture);
      }
      this._syncRainNode();
    }

    // ==================== ASMR STONE & FEEDBACK SOUNDS ====================
    playStone(opts = {}) {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureContext(true);
      if (!ctx || !this._sfxMaster) return;

      const profileKey = opts.acousticProfile || this.acousticProfile;
      const p = ACOUSTIC_PROFILES[profileKey] || ACOUSTIC_PROFILES['wood-warm'];
      const isCapture = Boolean(opts.isCapture);
      const captureCount = Number(opts.captureCount) || 0;
      const jitter = 0.95 + Math.random() * 0.1;
      const gainJitter = 0.9 + Math.random() * 0.18;
      const now = ctx.currentTime;

      // Layer 1: Dry crisp stone-on-board contact transient (~9ms, low-Q, no whistle)
      const clickLen = Math.max(16, Math.floor(ctx.sampleRate * 0.009));
      const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
      const clickData = clickBuf.getChannelData(0);
      for (let i = 0; i < clickLen; i++) {
        const u = 1 - i / clickLen;
        clickData[i] = (Math.random() * 2 - 1) * (u * u * u * u);
      }
      const clickSrc = ctx.createBufferSource();
      clickSrc.buffer = clickBuf;

      const clickBp = ctx.createBiquadFilter();
      clickBp.type = 'bandpass';
      clickBp.frequency.value = p.clickFreq * jitter;
      clickBp.Q.value = p.q;

      const clickLp = ctx.createBiquadFilter();
      clickLp.type = 'lowpass';
      clickLp.frequency.value = p.lowpass;

      const clickGain = ctx.createGain();
      clickGain.gain.setValueAtTime(0.42 * gainJitter, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.011);

      clickSrc.connect(clickBp);
      clickBp.connect(clickLp);
      clickLp.connect(clickGain);
      clickGain.connect(this._sfxMaster);
      if (this._sfxRoom) clickGain.connect(this._sfxRoom);
      clickSrc.start(now);

      // Layer 2: Tight damped wooden Goban body thock (~38-46ms)
      const bodyOsc = ctx.createOscillator();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(p.lowFreq * 1.24 * jitter, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(p.lowFreq * jitter, now + 0.012);

      const bodyGain = ctx.createGain();
      bodyGain.gain.setValueAtTime(0.32 * gainJitter, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.001, now + p.decay);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this._sfxMaster);
      if (this._sfxRoom) bodyGain.connect(this._sfxRoom);
      bodyOsc.start(now);
      bodyOsc.stop(now + p.decay + 0.008);

      // Layer 3: Subtle second wooden mode (~20ms)
      const woodOsc = ctx.createOscillator();
      woodOsc.type = 'sine';
      woodOsc.frequency.setValueAtTime(p.midFreq * jitter, now);
      woodOsc.frequency.exponentialRampToValueAtTime(p.midFreq * 0.85 * jitter, now + 0.022);

      const woodGain = ctx.createGain();
      woodGain.gain.setValueAtTime(0.09 * gainJitter, now);
      woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.022);

      woodOsc.connect(woodGain);
      woodGain.connect(this._sfxMaster);
      woodOsc.start(now);
      woodOsc.stop(now + 0.026);

      if (isCapture || captureCount > 0) {
        this.playCapture(Math.max(1, captureCount));
      }
    }

    playCapture(count = 1) {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureContext(true);
      if (!ctx || !this._sfxMaster) return;

      const stones = Math.min(4, Math.max(1, count));
      const base = ctx.currentTime + 0.085;

      // Soft staggered stone-in-wooden-bowl micro-clacks (zero high-pitched sine beeps)
      for (let i = 0; i < stones; i++) {
        const t = base + i * (0.058 + Math.random() * 0.036);
        const pan = (Math.random() - 0.5) * 0.45;

        const len = Math.max(16, Math.floor(ctx.sampleRate * 0.009));
        const buf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let k = 0; k < len; k++) {
          const u = 1 - k / len;
          data[k] = (Math.random() * 2 - 1) * (u * u * u);
        }
        const src = ctx.createBufferSource();
        src.buffer = buf;

        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1450 + Math.random() * 650;
        bp.Q.value = 1.1;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.16, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

        src.connect(bp);
        bp.connect(g);
        this._connectWithPan(g, this._sfxMaster, pan);
        src.start(t);

        // Soft wooden bowl resonance
        const bowl = ctx.createOscillator();
        bowl.type = 'sine';
        bowl.frequency.setValueAtTime(410 + Math.random() * 140, t);
        const bg = ctx.createGain();
        bg.gain.setValueAtTime(0.06, t);
        bg.gain.exponentialRampToValueAtTime(0.001, t + 0.022);
        bowl.connect(bg);
        this._connectWithPan(bg, this._sfxMaster, pan);
        bowl.start(t);
        bowl.stop(t + 0.026);
      }
    }

    playPreviewTick() {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureContext(true);
      if (!ctx || !this._sfxMaster) return;

      const now = ctx.currentTime;
      const len = Math.max(12, Math.floor(ctx.sampleRate * 0.005));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const u = 1 - i / len;
        data[i] = (Math.random() * 2 - 1) * (u * u * u);
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1150;
      bp.Q.value = 1.0;

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.007);

      src.connect(bp);
      bp.connect(g);
      g.connect(this._sfxMaster);
      src.start(now);
    }

    playSolved() {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureContext(true);
      if (!ctx || !this._sfxMaster) return;

      const notes = [392.0, 493.88, 587.33, 783.99]; // G4 - B4 - D5 - G5 warm chime
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.11;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const lp = ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 1800;

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.0008, t);
        g.gain.linearRampToValueAtTime(0.085, t + 0.022);
        g.gain.exponentialRampToValueAtTime(0.0008, t + 0.65);

        osc.connect(lp);
        lp.connect(g);
        g.connect(this._sfxMaster);
        if (this._sfxRoom) g.connect(this._sfxRoom);
        osc.start(t);
        osc.stop(t + 0.68);
      });
    }

    playSoftError() {
      if (!this.sfxEnabled) return;
      const ctx = this._ensureContext(true);
      if (!ctx || !this._sfxMaster) return;

      // Gentle muted double wooden knock
      const now = ctx.currentTime;
      [205, 162].forEach((freq, idx) => {
        const t = now + idx * 0.07;
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        const g = ctx.createGain();
        g.gain.setValueAtTime(0.08, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.032);

        osc.connect(g);
        g.connect(this._sfxMaster);
        osc.start(t);
        osc.stop(t + 0.038);
      });
    }

    // ==================== RELAXING ZEN BACKGROUND MUSIC ====================
    _startMusicEngine() {
      if (!this.ctx || !this._musicMaster || this._musicTimer) return;
      const now = this.ctx.currentTime;
      this._musicMaster.gain.cancelScheduledValues(now);
      this._musicMaster.gain.setTargetAtTime(this.musicVolume * 0.58, now, 0.55);

      if (this.musicTrack === 'koto-zen') {
        this._startWarmPad([146.83, 220.0]); // D3 + A3
        let step = 0;
        const phrase = [0, 2, 3, 5, 4, 2, 1, 3];
        const scheduleNext = () => {
          if (!this.musicEnabled || this.musicTrack !== 'koto-zen') return;
          if (Math.random() > 0.14) {
            const note = KOTO_NOTES[phrase[step % phrase.length]];
            const vel = 0.075 + Math.random() * 0.03;
            this._playKotoPluck(note, vel, (Math.random() - 0.5) * 0.35);
            if (step % 4 === 0) {
              this._playKotoPluck(note * 0.5, 0.055, -0.2);
            }
          }
          step += 1;
          const delayMs = 2100 + Math.random() * 1700;
          this._musicTimer = setTimeout(scheduleNext, delayMs);
        };
        scheduleNext();
      } else if (this.musicTrack === 'wind-chime') {
        this._startWarmPad([196.0, 293.66]); // G3 + D4
        const scheduleChime = () => {
          if (!this.musicEnabled || this.musicTrack !== 'wind-chime') return;
          const base = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
          this._playWindChime(base, 0.055, (Math.random() - 0.5) * 0.55);
          if (Math.random() > 0.55) {
            setTimeout(() => {
              if (this.musicEnabled && this.musicTrack === 'wind-chime') {
                const second = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)];
                this._playWindChime(second, 0.038, (Math.random() - 0.5) * 0.55);
              }
            }, 520 + Math.random() * 350);
          }
          const delayMs = 3400 + Math.random() * 2600;
          this._musicTimer = setTimeout(scheduleChime, delayMs);
        };
        scheduleChime();
      } else if (this.musicTrack === 'rain-dojo') {
        // Pure seamless rain + organic eaves patter (no synthetic sine bloops)
        this._musicTimer = setTimeout(() => {}, 60000);
      }
    }

    _stopMusicEngine() {
      if (this._musicTimer) {
        clearTimeout(this._musicTimer);
        this._musicTimer = null;
      }
      if (this.ctx && this._musicMaster) {
        this._musicMaster.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3);
      }
      for (const node of this._padNodes) {
        try {
          node.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
          node.osc.stop(this.ctx.currentTime + 0.55);
          if (node.lfo) node.lfo.stop(this.ctx.currentTime + 0.55);
        } catch (_e) {
          // Ignore
        }
      }
      this._padNodes = [];
    }

    _startWarmPad(freqs) {
      if (!this.ctx || !this._musicMaster) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < freqs.length; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freqs[i];

        const lp = this.ctx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 320;

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.024, now + 2.5);

        // Slow gentle breathing LFO
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.08 + i * 0.03;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 0.008;
        lfo.connect(lfoGain);
        lfoGain.connect(g.gain);

        osc.connect(lp);
        lp.connect(g);
        g.connect(this._musicMaster);
        osc.start(now);
        lfo.start(now);
        this._padNodes.push({ osc, gain: g, lfo });
      }
    }

    _playKotoPluck(freq, peak = 0.08, pan = 0) {
      if (!this.ctx || !this._reverb) return;
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(1450, now);
      lp.frequency.exponentialRampToValueAtTime(360, now + 1.9);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.0008, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0006, now + 2.8);

      const g2 = this.ctx.createGain();
      g2.gain.value = 0.18;

      osc1.connect(lp);
      osc2.connect(g2);
      g2.connect(lp);
      lp.connect(g);
      this._connectWithPan(g, this._reverb, pan);
      this._connectWithPan(g, this._musicMaster, pan);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.9);
      osc2.stop(now + 2.9);
    }

    _playWindChime(freq, peak = 0.05, pan = 0) {
      if (!this.ctx || !this._reverb) return;
      const now = this.ctx.currentTime;

      [1, 2.0].forEach((ratio, idx) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * ratio, now);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.0005, now);
        g.gain.linearRampToValueAtTime(idx === 0 ? peak : peak * 0.22, now + 0.045);
        g.gain.exponentialRampToValueAtTime(0.0005, now + (idx === 0 ? 3.5 : 1.8));

        osc.connect(g);
        this._connectWithPan(g, this._reverb, pan);
        osc.start(now);
        osc.stop(now + 3.6);
      });
    }

    _playSoftRaindrop(pan = 0) {
      if (!this.ctx || !this._rainMaster) return;
      const now = this.ctx.currentTime;
      const len = Math.max(12, Math.floor(this.ctx.sampleRate * 0.006));
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const u = 1 - i / len;
        data[i] = (Math.random() * 2 - 1) * (u * u * u);
      }
      const src = this.ctx.createBufferSource();
      src.buffer = buf;

      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 720 + Math.random() * 780;
      bp.Q.value = 1.0;

      const g = this.ctx.createGain();
      const peak = 0.025 + Math.random() * 0.025;
      g.gain.setValueAtTime(peak, now);
      g.gain.exponentialRampToValueAtTime(0.0008, now + 0.014);

      src.connect(bp);
      bp.connect(g);
      this._connectWithPan(g, this._rainMaster, pan);
      src.start(now);
    }

    _scheduleRainPatter() {
      if (this._rainPatterTimer) {
        clearTimeout(this._rainPatterTimer);
        this._rainPatterTimer = null;
      }
      const shouldPlay =
        this.rainEnabled || (this.musicEnabled && this.musicTrack === 'rain-dojo');
      if (!shouldPlay || !this.ctx) return;

      const tick = () => {
        const active =
          this.rainEnabled || (this.musicEnabled && this.musicTrack === 'rain-dojo');
        if (!active || !this._rainNodes) return;
        this._playSoftRaindrop((Math.random() - 0.5) * 1.4);
        this._rainPatterTimer = setTimeout(tick, 220 + Math.random() * 480);
      };
      this._rainPatterTimer = setTimeout(tick, 320);
    }

    _syncRainNode() {
      const shouldPlayRain =
        this.rainEnabled || (this.musicEnabled && this.musicTrack === 'rain-dojo');

      if (!this.ctx || !this._rainMaster || !this._rainBuffer) return;
      const now = this.ctx.currentTime;

      if (shouldPlayRain && (this._unlocked || this.ctx.state === 'running')) {
        if (!this._rainNodes) {
          const src = this.ctx.createBufferSource();
          src.buffer = this._rainBuffer;
          src.loop = true;

          const hp = this.ctx.createBiquadFilter();
          hp.type = 'highpass';
          hp.frequency.value = 85;

          const lp1 = this.ctx.createBiquadFilter();
          lp1.type = 'lowpass';
          lp1.frequency.value = 640;
          lp1.Q.value = 0.5;

          const lp2 = this.ctx.createBiquadFilter();
          lp2.type = 'lowpass';
          lp2.frequency.value = 920;
          lp2.Q.value = 0.5;

          const shelf = this.ctx.createBiquadFilter();
          shelf.type = 'highshelf';
          shelf.frequency.value = 1500;
          shelf.gain.value = -14;

          // Gentle natural breeze modulation on lowpass cutoff
          const lfo = this.ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.07;
          const lfoGain = this.ctx.createGain();
          lfoGain.gain.value = 110;
          lfo.connect(lfoGain);
          lfoGain.connect(lp1.frequency);

          src.connect(hp);
          hp.connect(lp1);
          lp1.connect(lp2);
          lp2.connect(shelf);
          shelf.connect(this._rainMaster);

          src.start(now);
          lfo.start(now);
          this._rainNodes = { src, lfo };
          this._scheduleRainPatter();
        }
        const target = this.musicVolume * 0.48;
        this._rainMaster.gain.setTargetAtTime(target, now, 0.55);
      } else {
        if (this._rainPatterTimer) {
          clearTimeout(this._rainPatterTimer);
          this._rainPatterTimer = null;
        }
        this._rainMaster.gain.setTargetAtTime(0, now, 0.35);
        if (this._rainNodes) {
          const old = this._rainNodes;
          this._rainNodes = null;
          setTimeout(() => {
            try {
              old.src.stop();
              old.lfo.stop();
            } catch (_e) {
              // Ignore
            }
          }, 650);
        }
      }
    }
  }

  const exportsObj = {
    MUSIC_TRACKS,
    ACOUSTIC_PROFILES,
    GoAudioEngine
  };

  root.GoAcademy = root.GoAcademy || {};
  Object.assign(root.GoAcademy, exportsObj);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  }
})(typeof window !== 'undefined' ? window : globalThis);
