(function (root) {
  'use strict';

  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;
  const COLUMNS = 'ABCDEFGHJKLMNOPQRST';

  const BOARD_SKINS = [
    {
      id: 'kaya',
      name: 'Gỗ Kaya Hoàng Gia',
      subtitle: 'Vân gỗ ấm cổ điển Nhật Bản',
      textureType: 'wood',
      acousticProfile: 'wood-warm',
      bgStops: ['#ecc789', '#dfb36c', '#cf9c4e'],
      grainDark: 'rgba(115, 68, 18, 0.05)',
      grainLight: 'rgba(255, 238, 198, 0.03)',
      borderColor: 'rgba(85, 48, 14, 0.42)',
      gridColor: '#33200f',
      starColor: '#291809',
      coordColor: 'rgba(54, 33, 14, 0.78)',
      lastMoveBlack: '#f7d57c',
      lastMoveWhite: '#c0392b',
      blackStone: ['#5e6572', '#24272d', '#0b0d11'],
      whiteStone: ['#ffffff', '#f2efe7', '#cbc3b4']
    },
    {
      id: 'walnut',
      name: 'Gỗ Óc Chó Cổ Điển',
      subtitle: 'Nâu trầm ấm, dịu mắt',
      textureType: 'wood',
      acousticProfile: 'wood-deep',
      bgStops: ['#7c5438', '#68432b', '#52331f'],
      grainDark: 'rgba(28, 14, 6, 0.14)',
      grainLight: 'rgba(224, 178, 134, 0.05)',
      borderColor: 'rgba(26, 13, 5, 0.65)',
      gridColor: '#e5c99b',
      starColor: '#f0d7ad',
      coordColor: 'rgba(240, 215, 173, 0.85)',
      lastMoveBlack: '#f7d57c',
      lastMoveWhite: '#b83728',
      blackStone: ['#5a6270', '#1f2329', '#090b0f'],
      whiteStone: ['#ffffff', '#f4efe6', '#d1c7b6']
    },
    {
      id: 'bamboo',
      name: 'Trúc Xanh Nhật Bản',
      subtitle: 'Thanh trúc sáng tự nhiên',
      textureType: 'bamboo',
      acousticProfile: 'wood-crisp',
      bgStops: ['#efe2b8', '#e3d29c', '#d5c082'],
      grainDark: 'rgba(130, 108, 45, 0.08)',
      grainLight: 'rgba(255, 252, 232, 0.07)',
      borderColor: 'rgba(105, 86, 35, 0.42)',
      gridColor: '#2c2b1c',
      starColor: '#232215',
      coordColor: 'rgba(44, 43, 28, 0.8)',
      lastMoveBlack: '#f6d57a',
      lastMoveWhite: '#b83728',
      blackStone: ['#57606c', '#20242a', '#0a0c10'],
      whiteStone: ['#ffffff', '#f6f4ee', '#d5cfc0']
    },
    {
      id: 'jade',
      name: 'Ngọc Bích Cố Đô',
      subtitle: 'Sắc ngọc thanh mát, thư thái',
      textureType: 'stone',
      acousticProfile: 'stone-jade',
      bgStops: ['#c9dfd1', '#b4d0bf', '#9dc0ac'],
      grainDark: 'rgba(34, 78, 56, 0.06)',
      grainLight: 'rgba(242, 252, 246, 0.09)',
      borderColor: 'rgba(36, 74, 54, 0.4)',
      gridColor: '#1f3b2c',
      starColor: '#162c20',
      coordColor: 'rgba(31, 59, 44, 0.8)',
      lastMoveBlack: '#fde047',
      lastMoveWhite: '#b91c1c',
      blackStone: ['#4c5961', '#1b2226', '#090d10'],
      whiteStone: ['#ffffff', '#f3f7f4', '#cad8cf']
    },
    {
      id: 'marble',
      name: 'Đá Cẩm Thạch Trắng',
      subtitle: 'Vân đá sang trọng hiện đại',
      textureType: 'stone',
      acousticProfile: 'stone-marble',
      bgStops: ['#f2f4f7', '#e5e9ef', '#d6dde6'],
      grainDark: 'rgba(95, 108, 128, 0.08)',
      grainLight: 'rgba(255, 255, 255, 0.25)',
      borderColor: 'rgba(100, 116, 139, 0.4)',
      gridColor: '#334155',
      starColor: '#1e293b',
      coordColor: 'rgba(51, 65, 85, 0.78)',
      lastMoveBlack: '#fbbf24',
      lastMoveWhite: '#dc2626',
      blackStone: ['#586270', '#1e242c', '#0b0e13'],
      whiteStone: ['#ffffff', '#f1f5f9', '#cbd5e1']
    },
    {
      id: 'midnight',
      name: 'Đêm Đạo Trường',
      subtitle: 'Nền tối bảo vệ mắt ban đêm',
      textureType: 'matte',
      acousticProfile: 'ceramic-soft',
      bgStops: ['#2a3240', '#212834', '#181e28'],
      grainDark: 'rgba(8, 12, 18, 0.16)',
      grainLight: 'rgba(148, 163, 184, 0.04)',
      borderColor: 'rgba(148, 163, 184, 0.28)',
      gridColor: '#cbd5e1',
      starColor: '#f59e0b',
      coordColor: 'rgba(203, 213, 225, 0.78)',
      lastMoveBlack: '#fbbf24',
      lastMoveWhite: '#e11d48',
      blackStone: ['#4b5563', '#181d25', '#06080b'],
      whiteStone: ['#ffffff', '#ece9e1', '#c7c1b4']
    }
  ];

  function getSkinById(skinId) {
    return BOARD_SKINS.find((s) => s.id === skinId) || BOARD_SKINS[0];
  }

  function detectCoarsePointer() {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  class GobanRenderer {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.engine = null;
      this.cropRect = null;
      this.skin = getSkinById(options.skinId || 'kaya');
      this.showCoordinates = options.showCoordinates !== false;
      this.showLiberties = Boolean(options.showLiberties);
      this.interactive = options.interactive !== false;
      this.hoverColor = BLACK;
      this.hoverCoord = null;
      this.touchConfirm = Boolean(options.touchConfirm);
      this.pendingMove = null;
      this.annotations = [];
      this.territoryMap = null;
      this.deadMap = null;
      this.scoringMode = false;
      this.onCellClick = options.onCellClick || null;
      this.onCellHover = options.onCellHover || null;
      this.onPendingMoveChange = options.onPendingMoveChange || null;

      this._metrics = null;
      this._pixelSize = 480;
      this._dpr = 1;
      this._grainSeed = 42;
      this._touchStart = null;
      this._lastPointerType = 'mouse';
      this._rafId = null;
      this._bgCanvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
      this._bgCacheKey = '';

      this._bindEvents();
      this._syncTouchAction();
      this.resize();
    }

    setSkin(skinId) {
      this.skin = getSkinById(skinId);
      this._bgCacheKey = '';
      this.scheduleRender();
      return this.skin;
    }

    getSkin() {
      return this.skin;
    }

    _syncTouchAction() {
      if (!this.canvas) return;
      // Always allow natural page vertical scrolling over the board
      this.canvas.style.touchAction = 'manipulation';
      this.canvas.style.cursor = this.interactive ? 'pointer' : 'default';
    }

    scheduleRender() {
      if (typeof requestAnimationFrame !== 'function') {
        this.render();
        return;
      }
      if (this._rafId) return;
      this._rafId = requestAnimationFrame(() => {
        this._rafId = null;
        this.render();
      });
    }

    _emitPendingChange() {
      if (this.onPendingMoveChange) {
        this.onPendingMoveChange(this.pendingMove ? { ...this.pendingMove } : null);
      }
    }

    _setPendingCoord(coord) {
      if (!coord || !this.engine) {
        this.clearPendingMove();
        return;
      }
      if (this.scoringMode) {
        this.clearPendingMove();
        if (this.onCellClick) this.onCellClick(coord.x, coord.y);
        return;
      }
      const check = this.engine.isLegalMove(coord.x, coord.y, this.hoverColor);
      if (!check.legal) {
        this.clearPendingMove();
        if (this.onCellClick) this.onCellClick(coord.x, coord.y);
        return;
      }
      const coordStr = root.GoAcademy.coordToString(coord.x, coord.y, this.engine.size);
      if (
        this.pendingMove &&
        this.pendingMove.x === coord.x &&
        this.pendingMove.y === coord.y
      ) {
        return;
      }
      this.pendingMove = { x: coord.x, y: coord.y, coordStr };
      this._emitPendingChange();
      this.render();
    }

    setTouchConfirm(flag) {
      this.touchConfirm = Boolean(flag);
      if (!this.touchConfirm) {
        this.clearPendingMove();
      }
      this._syncTouchAction();
      this.render();
    }

    getPendingMove() {
      return this.pendingMove ? { ...this.pendingMove } : null;
    }

    clearPendingMove() {
      if (!this.pendingMove) return;
      this.pendingMove = null;
      this._emitPendingChange();
      this.render();
    }

    confirmPendingMove() {
      if (!this.pendingMove || !this.interactive) return false;
      const { x, y } = this.pendingMove;
      this.pendingMove = null;
      this._emitPendingChange();
      this.render();
      if (this.onCellClick) {
        this.onCellClick(x, y);
      }
      return true;
    }

    _bindEvents() {
      this._onPointerDown = (e) => {
        this._lastPointerType = e.pointerType || 'mouse';
        if (!this.interactive || !this.engine) return;

        if (this._lastPointerType === 'touch') {
          this._touchStart = {
            x: e.clientX,
            y: e.clientY,
            pointerId: e.pointerId
          };
        }
      };

      this._onPointerMove = (e) => {
        if (!this.interactive || !this.engine) return;
        const pType = e.pointerType || this._lastPointerType;
        if (pType === 'touch') return;

        const coord = this._clientToBoard(e.clientX, e.clientY);
        const changed =
          (coord && !this.hoverCoord) ||
          (!coord && this.hoverCoord) ||
          (coord &&
            this.hoverCoord &&
            (coord.x !== this.hoverCoord.x || coord.y !== this.hoverCoord.y));
        if (changed) {
          this.hoverCoord = coord;
          if (this.onCellHover) this.onCellHover(coord);
          this.scheduleRender();
        }
      };

      this._onPointerUp = (e) => {
        if (e.pointerType !== 'touch' || !this._touchStart) return;
        const start = this._touchStart;
        this._touchStart = null;
        if (!this.interactive || !this.engine) return;

        // Ignore scroll/swipe gestures so page scrolling stays 100% fluid
        const moved = Math.hypot(e.clientX - start.x, e.clientY - start.y);
        if (moved > 12) return;

        const coord = this._clientToBoard(e.clientX, e.clientY, 0.56);
        if (!coord) return;

        if (!this.touchConfirm) {
          if (this.onCellClick) this.onCellClick(coord.x, coord.y);
          return;
        }

        if (
          this.pendingMove &&
          this.pendingMove.x === coord.x &&
          this.pendingMove.y === coord.y
        ) {
          this.confirmPendingMove();
        } else {
          this._setPendingCoord(coord);
        }
      };

      this._onPointerCancel = () => {
        this._touchStart = null;
      };

      this._onPointerLeave = () => {
        this._touchStart = null;
        if (this.hoverCoord) {
          this.hoverCoord = null;
          if (this.onCellHover) this.onCellHover(null);
          this.scheduleRender();
        }
      };

      this._onClick = (e) => {
        if (!this.interactive || !this.engine) return;
        if (this._lastPointerType === 'touch') {
          return;
        }
        const coord = this._clientToBoard(e.clientX, e.clientY);
        if (coord && this.onCellClick) {
          this.onCellClick(coord.x, coord.y);
        }
      };

      this.canvas.addEventListener('pointerdown', this._onPointerDown);
      this.canvas.addEventListener('pointermove', this._onPointerMove);
      this.canvas.addEventListener('pointerup', this._onPointerUp);
      this.canvas.addEventListener('pointercancel', this._onPointerCancel);
      this.canvas.addEventListener('pointerleave', this._onPointerLeave);
      this.canvas.addEventListener('click', this._onClick);

      if (typeof ResizeObserver !== 'undefined') {
        this._ro = new ResizeObserver(() => this.resize());
        if (this.canvas.parentElement) {
          this._ro.observe(this.canvas.parentElement);
        }
      }
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      const parent = this.canvas.parentElement;
      // Do not size with a fake 540px fallback while tab is hidden (display: none)
      if (!parent || parent.clientWidth <= 0) {
        return;
      }
      const style = window.getComputedStyle(parent);
      const padH =
        (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      const vwCap =
        typeof document !== 'undefined' && document.documentElement.clientWidth
          ? document.documentElement.clientWidth - 28
          : 560;
      const avail = Math.min(parent.clientWidth - padH, vwCap);
      const targetCssSize = Math.max(240, Math.min(avail, 560));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      if (this._pixelSize === targetCssSize && this._dpr === dpr && this.canvas.width > 0) {
        return;
      }

      this._pixelSize = targetCssSize;
      this._dpr = dpr;
      this._bgCacheKey = '';
      this.canvas.style.width = `${targetCssSize}px`;
      this.canvas.style.height = `${targetCssSize}px`;
      this.canvas.style.maxWidth = '100%';
      this.canvas.width = Math.round(targetCssSize * dpr);
      this.canvas.height = Math.round(targetCssSize * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.scheduleRender();
    }

    setEngine(engine) {
      this.engine = engine;
      this.clearPendingMove();
      this.render();
    }

    setCropRect(cropRect) {
      this.cropRect = cropRect || null;
      this.clearPendingMove();
      this.render();
    }

    setAnnotations(annotations) {
      this.annotations = Array.isArray(annotations) ? annotations : [];
      this.render();
    }

    setTerritoryMap(territoryMap) {
      this.territoryMap = territoryMap || null;
      this.render();
    }

    setDeadMap(deadMap) {
      this.deadMap = deadMap || null;
      this.render();
    }

    setScoringMode(flag) {
      this.scoringMode = Boolean(flag);
      if (this.scoringMode) {
        this.clearPendingMove();
      }
      this._syncTouchAction();
      this.render();
    }

    setShowLiberties(flag) {
      this.showLiberties = Boolean(flag);
      this.render();
    }

    setHoverColor(color) {
      this.hoverColor = color;
      this.render();
    }

    setInteractive(flag) {
      this.interactive = Boolean(flag);
      if (!this.interactive) {
        this.hoverCoord = null;
        this.clearPendingMove();
      }
      this._syncTouchAction();
      this.render();
    }

    _computeMetrics() {
      if (!this.engine) return null;
      const size = this.engine.size;
      const minX = this.cropRect ? Math.max(0, this.cropRect.minX) : 0;
      const maxX = this.cropRect ? Math.min(size - 1, this.cropRect.maxX) : size - 1;
      const minY = this.cropRect ? Math.max(0, this.cropRect.minY) : 0;
      const maxY = this.cropRect ? Math.min(size - 1, this.cropRect.maxY) : size - 1;

      const cols = maxX - minX + 1;
      const rows = maxY - minY + 1;
      const span = Math.max(cols, rows);

      const pad = this.showCoordinates
        ? Math.max(24, this._pixelSize * 0.066)
        : Math.max(16, this._pixelSize * 0.044);
      const drawable = this._pixelSize - pad * 2;
      const cell = span > 1 ? drawable / (span - 1) : drawable;

      const offsetX = pad + ((span - cols) * cell) / 2;
      const offsetY = pad + ((span - rows) * cell) / 2;

      return { size, minX, maxX, minY, maxY, cols, rows, cell, offsetX, offsetY, pad };
    }

    _boardToCanvas(x, y, m) {
      return {
        cx: m.offsetX + (x - m.minX) * m.cell,
        cy: m.offsetY + (y - m.minY) * m.cell
      };
    }

    _clientToBoard(clientX, clientY, tolerance = 0.49) {
      if (!this._metrics || !this.engine) return null;
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const px = ((clientX - rect.left) / rect.width) * this._pixelSize;
      const py = ((clientY - rect.top) / rect.height) * this._pixelSize;
      const m = this._metrics;

      const gx = Math.round((px - m.offsetX) / m.cell) + m.minX;
      const gy = Math.round((py - m.offsetY) / m.cell) + m.minY;

      if (gx < m.minX || gx > m.maxX || gy < m.minY || gy > m.maxY) return null;
      const pos = this._boardToCanvas(gx, gy, m);
      const dist = Math.hypot(px - pos.cx, py - pos.cy);
      if (dist > m.cell * tolerance) return null;
      return { x: gx, y: gy };
    }

    _ensureStaticBackground(m, S) {
      const cropKey = this.cropRect
        ? `${this.cropRect.minX},${this.cropRect.maxX},${this.cropRect.minY},${this.cropRect.maxY}`
        : 'full';
      const key = `${this.skin.id}|${m.size}|${cropKey}|${S}|${this._dpr}|${this.showCoordinates ? 1 : 0}`;
      if (!this._bgCanvas) {
        this._drawBoardSurface(this.ctx, S);
        this._drawGrid(this.ctx, m);
        this._drawStarPoints(this.ctx, m);
        if (this.showCoordinates) this._drawCoordinates(this.ctx, m);
        return false;
      }
      if (this._bgCacheKey !== key) {
        this._bgCacheKey = key;
        const dpr = this._dpr || 1;
        this._bgCanvas.width = Math.round(S * dpr);
        this._bgCanvas.height = Math.round(S * dpr);
        const bgCtx = this._bgCanvas.getContext('2d');
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this._drawBoardSurface(bgCtx, S);
        this._drawGrid(bgCtx, m);
        this._drawStarPoints(bgCtx, m);
        if (this.showCoordinates) this._drawCoordinates(bgCtx, m);
      }
      this.ctx.drawImage(this._bgCanvas, 0, 0, S, S);
      return true;
    }

    render() {
      const ctx = this.ctx;
      const S = this._pixelSize;
      ctx.clearRect(0, 0, S, S);

      if (!this.engine) return;
      const m = this._computeMetrics();
      this._metrics = m;

      this._ensureStaticBackground(m, S);
      if (this.deadMap) {
        this._drawStones(ctx, m);
        if (this.territoryMap) this._drawTerritory(ctx, m);
      } else {
        if (this.territoryMap) this._drawTerritory(ctx, m);
        this._drawStones(ctx, m);
      }
      this._drawLastMove(ctx, m);
      if (this.showLiberties) this._drawLiberties(ctx, m);
      this._drawHoverGhost(ctx, m);
      this._drawPendingMove(ctx, m);
      this._drawAnnotations(ctx, m);
    }

    _drawBoardSurface(ctx, S) {
      const sk = this.skin;
      const grad = ctx.createLinearGradient(0, 0, S, S);
      grad.addColorStop(0, sk.bgStops[0]);
      grad.addColorStop(0.5, sk.bgStops[1]);
      grad.addColorStop(1, sk.bgStops[2]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, S, S);

      ctx.save();
      if (sk.textureType === 'wood') {
        ctx.lineWidth = 1;
        for (let i = 0; i < 42; i++) {
          const y = (i / 42) * S;
          ctx.strokeStyle = i % 2 === 0 ? sk.grainDark : sk.grainLight;
          ctx.beginPath();
          ctx.moveTo(0, y);
          const wave = Math.sin(i * 0.68 + this._grainSeed) * 3.8;
          ctx.bezierCurveTo(S * 0.33, y + wave, S * 0.66, y - wave, S, y + wave * 0.5);
          ctx.stroke();
        }
      } else if (sk.textureType === 'bamboo') {
        const slats = 14;
        const slatW = S / slats;
        for (let i = 0; i < slats; i++) {
          ctx.fillStyle = i % 2 === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(110,85,20,0.035)';
          ctx.fillRect(i * slatW, 0, slatW, S);
          ctx.strokeStyle = sk.grainDark;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(i * slatW, 0);
          ctx.lineTo(i * slatW, S);
          ctx.stroke();
          // Subtle bamboo node notch
          const nodeY = ((i * 73 + 29) % 80) * (S / 100) + S * 0.1;
          ctx.strokeStyle = 'rgba(110, 88, 30, 0.14)';
          ctx.beginPath();
          ctx.moveTo(i * slatW + 1, nodeY);
          ctx.lineTo((i + 1) * slatW - 1, nodeY);
          ctx.stroke();
        }
      } else if (sk.textureType === 'stone') {
        // Subtle diagonal stone veins
        ctx.lineWidth = 1.4;
        for (let i = 0; i < 16; i++) {
          const startY = (i / 16) * S * 1.3 - S * 0.15;
          ctx.strokeStyle = i % 3 === 0 ? sk.grainDark : sk.grainLight;
          ctx.beginPath();
          ctx.moveTo(0, startY);
          const cp1y = startY + Math.sin(i * 1.4) * 28;
          const cp2y = startY - Math.cos(i * 1.1) * 32;
          ctx.bezierCurveTo(S * 0.3, cp1y, S * 0.7, cp2y, S, startY + (i % 2 === 0 ? 40 : -30));
          ctx.stroke();
        }
      } else {
        // Matte subtle radial studio glow
        const glow = ctx.createRadialGradient(S * 0.5, S * 0.45, S * 0.08, S * 0.5, S * 0.5, S * 0.65);
        glow.addColorStop(0, sk.grainLight);
        glow.addColorStop(1, sk.grainDark);
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, S, S);
      }

      // Soft inner edge vignette
      const edge = ctx.createRadialGradient(S / 2, S / 2, S * 0.35, S / 2, S / 2, S * 0.72);
      edge.addColorStop(0, 'rgba(0,0,0,0)');
      edge.addColorStop(1, 'rgba(20, 12, 4, 0.1)');
      ctx.fillStyle = edge;
      ctx.fillRect(0, 0, S, S);

      // Framed bevel
      ctx.strokeStyle = sk.borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, S - 2, S - 2);
      ctx.restore();
    }

    _drawGrid(ctx, m) {
      ctx.save();
      ctx.strokeStyle = this.skin.gridColor;

      const left = m.offsetX;
      const right = m.offsetX + (m.cols - 1) * m.cell;
      const top = m.offsetY;
      const bottom = m.offsetY + (m.rows - 1) * m.cell;

      for (let x = m.minX; x <= m.maxX; x++) {
        const cx = Math.round(m.offsetX + (x - m.minX) * m.cell) + 0.5;
        const isBorder = x === 0 || x === m.size - 1;
        ctx.lineWidth = isBorder ? 1.8 : 1;
        ctx.beginPath();
        ctx.moveTo(cx, top);
        ctx.lineTo(cx, bottom);
        ctx.stroke();
      }

      for (let y = m.minY; y <= m.maxY; y++) {
        const cy = Math.round(m.offsetY + (y - m.minY) * m.cell) + 0.5;
        const isBorder = y === 0 || y === m.size - 1;
        ctx.lineWidth = isBorder ? 1.8 : 1;
        ctx.beginPath();
        ctx.moveTo(left, cy);
        ctx.lineTo(right, cy);
        ctx.stroke();
      }
      ctx.restore();
    }

    _drawStarPoints(ctx, m) {
      const getStarPoints = root.GoAcademy.getStarPoints;
      const stars = getStarPoints(m.size);
      const radius = Math.max(2.6, Math.min(4.5, m.cell * 0.1));

      ctx.save();
      ctx.fillStyle = this.skin.starColor;
      for (const pt of stars) {
        if (pt.x < m.minX || pt.x > m.maxX || pt.y < m.minY || pt.y > m.maxY) continue;
        const { cx, cy } = this._boardToCanvas(pt.x, pt.y, m);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    _drawCoordinates(ctx, m) {
      ctx.save();
      const fontSize = Math.max(8.5, Math.min(12, m.cell * 0.31));
      ctx.font = `600 ${fontSize}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = this.skin.coordColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const topY = m.offsetY - Math.max(12, m.pad * 0.52);
      const botY = m.offsetY + (m.rows - 1) * m.cell + Math.max(12, m.pad * 0.52);

      for (let x = m.minX; x <= m.maxX; x++) {
        const cx = m.offsetX + (x - m.minX) * m.cell;
        const label = COLUMNS[x];
        ctx.fillText(label, cx, topY);
        ctx.fillText(label, cx, botY);
      }

      const leftX = m.offsetX - Math.max(12, m.pad * 0.52);
      const rightX = m.offsetX + (m.cols - 1) * m.cell + Math.max(12, m.pad * 0.52);

      for (let y = m.minY; y <= m.maxY; y++) {
        const cy = m.offsetY + (y - m.minY) * m.cell;
        const label = String(m.size - y);
        ctx.fillText(label, leftX, cy);
        ctx.fillText(label, rightX, cy);
      }
      ctx.restore();
    }

    _drawStones(ctx, m) {
      const r = m.cell * 0.468;
      for (let y = m.minY; y <= m.maxY; y++) {
        for (let x = m.minX; x <= m.maxX; x++) {
          const c = this.engine.get(x, y);
          if (c === EMPTY) continue;
          const isDead = Boolean(this.deadMap && this.deadMap[this.engine.idx(x, y)] === 1);
          const { cx, cy } = this._boardToCanvas(x, y, m);
          this._drawSingleStone(ctx, cx, cy, r, c, isDead ? 0.36 : 1);
          if (isDead) {
            ctx.save();
            ctx.strokeStyle = c === BLACK ? '#ef4444' : '#dc2626';
            ctx.lineWidth = Math.max(2, m.cell * 0.075);
            const d = r * 0.42;
            ctx.beginPath();
            ctx.moveTo(cx - d, cy - d);
            ctx.lineTo(cx + d, cy + d);
            ctx.moveTo(cx + d, cy - d);
            ctx.lineTo(cx - d, cy + d);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    _drawSingleStone(ctx, cx, cy, r, color, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;

      ctx.fillStyle = 'rgba(12, 8, 4, 0.36)';
      ctx.beginPath();
      ctx.arc(cx + r * 0.1, cy + r * 0.15, r * 0.99, 0, Math.PI * 2);
      ctx.fill();

      const palette = color === BLACK ? this.skin.blackStone : this.skin.whiteStone;
      const grad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.32, r * 0.08, cx, cy, r);
      grad.addColorStop(0, palette[0]);
      grad.addColorStop(color === BLACK ? 0.35 : 0.65, palette[1]);
      grad.addColorStop(1, palette[2]);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      if (color === WHITE) {
        ctx.strokeStyle = 'rgba(85, 70, 50, 0.28)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (this.skin.id === 'midnight') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      ctx.restore();
    }

    _drawLastMove(ctx, m) {
      const lm = this.engine.lastMove;
      if (!lm) return;
      if (lm.x < m.minX || lm.x > m.maxX || lm.y < m.minY || lm.y > m.maxY) return;
      const { cx, cy } = this._boardToCanvas(lm.x, lm.y, m);
      const r = m.cell * 0.22;

      ctx.save();
      ctx.strokeStyle =
        lm.color === BLACK ? this.skin.lastMoveBlack : this.skin.lastMoveWhite;
      ctx.lineWidth = Math.max(1.8, m.cell * 0.068);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    _drawLiberties(ctx, m) {
      const shown = new Set();
      const addLiberty = (pt, inAtari) => {
        if (pt.x < m.minX || pt.x > m.maxX || pt.y < m.minY || pt.y > m.maxY) return;
        const key = `${pt.x},${pt.y},${inAtari ? 1 : 0}`;
        if (shown.has(key)) return;
        shown.add(key);
        const { cx, cy } = this._boardToCanvas(pt.x, pt.y, m);
        ctx.save();
        ctx.fillStyle = inAtari ? '#dc2626' : '#0284c7';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(4, m.cell * 0.14), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      };

      if (this.hoverCoord && this.engine.get(this.hoverCoord.x, this.hoverCoord.y) !== EMPTY) {
        const grp = this.engine.getGroup(this.hoverCoord.x, this.hoverCoord.y);
        if (grp) {
          const inAtari = grp.liberties.length === 1;
          for (const lib of grp.liberties) addLiberty(lib, inAtari);
        }
      }

      const groups = this.engine.getAllGroups();
      for (const grp of groups) {
        if (grp.liberties.length <= 2 || grp.stones.length <= 6) {
          const inAtari = grp.liberties.length === 1;
          if (
            inAtari ||
            !this.hoverCoord ||
            this.engine.get(this.hoverCoord.x, this.hoverCoord.y) === EMPTY
          ) {
            for (const lib of grp.liberties) addLiberty(lib, inAtari);
          }
        }
      }
    }

    _drawHoverGhost(ctx, m) {
      if (!this.interactive || !this.hoverCoord || this.pendingMove) return;
      const { x, y } = this.hoverCoord;
      if (this.scoringMode) {
        if (this.engine.get(x, y) === EMPTY) return;
        const grp = this.engine.getGroup(x, y);
        if (!grp) return;
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = Math.max(2, m.cell * 0.065);
        ctx.setLineDash([4, 3]);
        const r = m.cell * 0.49;
        for (const st of grp.stones) {
          if (st.x < m.minX || st.x > m.maxX || st.y < m.minY || st.y > m.maxY) continue;
          const { cx, cy } = this._boardToCanvas(st.x, st.y, m);
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }
      if (this.engine.get(x, y) !== EMPTY) return;
      const check = this.engine.isLegalMove(x, y, this.hoverColor);
      const { cx, cy } = this._boardToCanvas(x, y, m);
      const r = m.cell * 0.45;

      if (check.legal) {
        this._drawSingleStone(ctx, cx, cy, r, this.hoverColor, 0.45);
      } else {
        ctx.save();
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.85)';
        ctx.lineWidth = 2.2;
        const d = r * 0.45;
        ctx.beginPath();
        ctx.moveTo(cx - d, cy - d);
        ctx.lineTo(cx + d, cy + d);
        ctx.moveTo(cx + d, cy - d);
        ctx.lineTo(cx - d, cy + d);
        ctx.stroke();
        ctx.restore();
      }
    }

    _drawPendingMove(ctx, m) {
      if (!this.interactive || !this.pendingMove) return;
      const { x, y } = this.pendingMove;
      if (x < m.minX || x > m.maxX || y < m.minY || y > m.maxY) return;
      const { cx, cy } = this._boardToCanvas(x, y, m);
      const r = m.cell * 0.46;

      ctx.save();
      ctx.strokeStyle = 'rgba(184, 55, 40, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(m.offsetX, cy);
      ctx.lineTo(m.offsetX + (m.cols - 1) * m.cell, cy);
      ctx.moveTo(cx, m.offsetY);
      ctx.lineTo(cx, m.offsetY + (m.rows - 1) * m.cell);
      ctx.stroke();
      ctx.restore();

      this._drawSingleStone(ctx, cx, cy, r, this.hoverColor, 0.78);

      ctx.save();
      ctx.strokeStyle = '#b83728';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    _drawTerritory(ctx, m) {
      const boxSize = Math.max(8, m.cell * 0.34);
      for (let y = m.minY; y <= m.maxY; y++) {
        for (let x = m.minX; x <= m.maxX; x++) {
          const owner = this.territoryMap[this.engine.idx(x, y)];
          if (owner === EMPTY) continue;
          const { cx, cy } = this._boardToCanvas(x, y, m);
          ctx.save();
          ctx.fillStyle =
            owner === BLACK ? 'rgba(17, 24, 39, 0.72)' : 'rgba(255, 255, 255, 0.85)';
          ctx.strokeStyle =
            owner === BLACK ? 'rgba(255,255,255,0.35)' : 'rgba(30,41,59,0.45)';
          ctx.lineWidth = 1;
          ctx.fillRect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize);
          ctx.strokeRect(cx - boxSize / 2, cy - boxSize / 2, boxSize, boxSize);
          ctx.restore();
        }
      }
    }

    _drawAnnotations(ctx, m) {
      if (!this.annotations || this.annotations.length === 0) return;

      for (const ann of this.annotations) {
        if (ann.x < m.minX || ann.x > m.maxX || ann.y < m.minY || ann.y > m.maxY) continue;
        const { cx, cy } = this._boardToCanvas(ann.x, ann.y, m);
        const stoneColor = this.engine.get(ann.x, ann.y);
        const defaultStroke =
          stoneColor === BLACK ? '#fbbf24' : stoneColor === WHITE ? '#dc2626' : '#b91c1c';
        const color = ann.color || defaultStroke;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = Math.max(2, m.cell * 0.065);

        if (ann.type === 'circle') {
          ctx.beginPath();
          ctx.arc(cx, cy, m.cell * 0.27, 0, Math.PI * 2);
          ctx.stroke();
        } else if (ann.type === 'triangle') {
          const r = m.cell * 0.29;
          ctx.beginPath();
          ctx.moveTo(cx, cy - r);
          ctx.lineTo(cx + r * 0.866, cy + r * 0.5);
          ctx.lineTo(cx - r * 0.866, cy + r * 0.5);
          ctx.closePath();
          ctx.stroke();
        } else if (ann.type === 'square') {
          const s = m.cell * 0.44;
          ctx.strokeRect(cx - s / 2, cy - s / 2, s, s);
        } else if (ann.type === 'cross') {
          const d = m.cell * 0.22;
          ctx.beginPath();
          ctx.moveTo(cx - d, cy - d);
          ctx.lineTo(cx + d, cy + d);
          ctx.moveTo(cx + d, cy - d);
          ctx.lineTo(cx - d, cy + d);
          ctx.stroke();
        } else if (ann.type === 'dot') {
          ctx.beginPath();
          ctx.arc(cx, cy, Math.max(4, m.cell * 0.14), 0, Math.PI * 2);
          ctx.fill();
        } else if (ann.type === 'label') {
          if (ann.badge) {
            ctx.fillStyle = ann.color || '#16a34a';
            ctx.beginPath();
            ctx.arc(cx, cy, m.cell * 0.34, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = Math.max(1.5, m.cell * 0.05);
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            const fs = Math.max(11, Math.min(18, m.cell * 0.44));
            ctx.font = `700 ${fs}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(ann.text || '', cx, cy + 0.5);
          } else {
            if (stoneColor === EMPTY) {
              ctx.fillStyle = 'rgba(222, 178, 108, 0.92)';
              ctx.beginPath();
              ctx.arc(cx, cy, m.cell * 0.3, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.fillStyle = stoneColor === BLACK ? '#f8fafc' : '#1e293b';
            const fs = Math.max(11, Math.min(18, m.cell * 0.44));
            ctx.font = `700 ${fs}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(ann.text || '', cx, cy + 0.5);
          }
        }

        ctx.restore();
      }
    }
  }

  root.GoAcademy = root.GoAcademy || {};
  root.GoAcademy.BOARD_SKINS = BOARD_SKINS;
  root.GoAcademy.getSkinById = getSkinById;
  root.GoAcademy.GobanRenderer = GobanRenderer;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOARD_SKINS, getSkinById, GobanRenderer };
  }
})(typeof window !== 'undefined' ? window : globalThis);
