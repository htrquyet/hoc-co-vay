(function (root) {
  'use strict';

  const EMPTY = 0;
  const BLACK = 1;
  const WHITE = 2;
  const COLUMNS = 'ABCDEFGHJKLMNOPQRST';

  function opponentOf(color) {
    return color === BLACK ? WHITE : BLACK;
  }

  function coordToString(x, y, size) {
    if (x < 0 || y < 0 || x >= size || y >= size) return '';
    return COLUMNS[x] + String(size - y);
  }

  function stringToCoord(str, size) {
    if (!str || str.length < 2) return null;
    const colChar = str[0].toUpperCase();
    const x = COLUMNS.indexOf(colChar);
    const rowNum = parseInt(str.slice(1), 10);
    if (x < 0 || Number.isNaN(rowNum)) return null;
    const y = size - rowNum;
    if (x < 0 || x >= size || y < 0 || y >= size) return null;
    return { x, y };
  }

  function getStarPoints(size) {
    if (size === 9) {
      return [
        { x: 2, y: 2 },
        { x: 6, y: 2 },
        { x: 4, y: 4 },
        { x: 2, y: 6 },
        { x: 6, y: 6 }
      ];
    }
    if (size === 13) {
      return [
        { x: 3, y: 3 },
        { x: 9, y: 3 },
        { x: 6, y: 6 },
        { x: 3, y: 9 },
        { x: 9, y: 9 }
      ];
    }
    if (size === 19) {
      const coords = [3, 9, 15];
      const pts = [];
      for (const y of coords) {
        for (const x of coords) {
          pts.push({ x, y });
        }
      }
      return pts;
    }
    return [];
  }

  const BOT_RANKS = [
    {
      id: '20k',
      short: '20K',
      name: '20 Kyu (Nhập Môn)',
      desc: 'Đánh nhẹ nhàng, thỉnh thoảng bỏ sót để người mới dễ tập vây đất.',
      noise: 24,
      topPool: 5,
      lookahead: 0,
      rollouts: 0,
      maxMs: 25
    },
    {
      id: '10k',
      short: '10K',
      name: '10 Kyu (Cơ Bản)',
      desc: 'Biết bắt quân, cứu quân bị Atari và tránh tự sát.',
      noise: 4,
      topPool: 1,
      lookahead: 0,
      rollouts: 0,
      maxMs: 40
    },
    {
      id: '1d',
      short: '1D',
      name: 'Nhất Đẳng (1 Dan)',
      desc: 'Nắm vững hình cờ đẹp, đọc phản đòn 1 nước và bảo vệ điểm cắt.',
      noise: 1.5,
      topPool: 1,
      lookahead: 1,
      rollouts: 0,
      maxMs: 65
    },
    {
      id: '3d',
      short: '3D',
      name: 'Tam Đẳng (3 Dan)',
      desc: 'Đọc biến chiến thuật 2 nước kết hợp mô phỏng Monte Carlo nhanh.',
      noise: 0.6,
      topPool: 1,
      lookahead: 2,
      rollouts: 24,
      maxMs: 140
    },
    {
      id: '4d',
      short: '4D',
      name: 'Tứ Đẳng (4 Dan)',
      desc: 'Tính toán sâu hơn ở trung cuộc và đánh giá cân bằng toàn bàn.',
      noise: 0.35,
      topPool: 1,
      lookahead: 2,
      rollouts: 44,
      maxMs: 240
    },
    {
      id: '6d',
      short: '6D',
      name: 'Lục Đẳng (6 Dan)',
      desc: 'Cường độ tính toán cao, phản công sắc bén và giữ tiên thủ tốt.',
      noise: 0.2,
      topPool: 1,
      lookahead: 2,
      rollouts: 80,
      maxMs: 380
    },
    {
      id: '9d',
      short: '9D',
      name: 'Cửu Đẳng (9 Dan)',
      desc: 'Mức Kỳ Thánh tối đa trên trình duyệt: đọc sâu và tối ưu từng nước.',
      noise: 0.1,
      topPool: 1,
      lookahead: 2,
      rollouts: 130,
      maxMs: 560
    }
  ];

  function getRankConfig(rankId) {
    return BOT_RANKS.find((r) => r.id === rankId) || BOT_RANKS[2];
  }

  function getHandicapPoints(size, count) {
    const n = Number(count) || 0;
    if (n < 2) return [];
    const lo = size === 9 ? 2 : 3;
    const hi = size - 1 - lo;
    const mid = Math.floor(size / 2);

    const tr = [hi, lo];
    const bl = [lo, hi];
    const br = [hi, hi];
    const tl = [lo, lo];
    const tengen = [mid, mid];
    const left = [lo, mid];
    const right = [hi, mid];
    const top = [mid, lo];
    const bot = [mid, hi];

    if (n === 2) return [tr, bl];
    if (n === 3) return [tr, bl, br];
    if (n === 4) return [tr, bl, br, tl];
    if (n === 5) return [tr, bl, br, tl, tengen];
    if (n === 9) return [tr, bl, br, tl, left, right, top, bot, tengen];
    return [tr, bl, br, tl].slice(0, Math.min(4, n));
  }

  class GoEngine {
    constructor(size = 9) {
      this.size = size;
      this.board = new Int8Array(size * size);
      this.turn = BLACK;
      this.captures = { [BLACK]: 0, [WHITE]: 0 };
      this.koPoint = null;
      this.history = [];
      this.lastMove = null;
      this.consecutivePasses = 0;
      this.moveCount = 0;
    }

    inBounds(x, y) {
      return x >= 0 && y >= 0 && x < this.size && y < this.size;
    }

    idx(x, y) {
      return y * this.size + x;
    }

    get(x, y) {
      if (!this.inBounds(x, y)) return -1;
      return this.board[this.idx(x, y)];
    }

    set(x, y, color) {
      this.board[this.idx(x, y)] = color;
    }

    neighbors(x, y) {
      const list = [];
      if (x > 0) list.push({ x: x - 1, y });
      if (x < this.size - 1) list.push({ x: x + 1, y });
      if (y > 0) list.push({ x, y: y - 1 });
      if (y < this.size - 1) list.push({ x, y: y + 1 });
      return list;
    }

    clone() {
      const copy = new GoEngine(this.size);
      copy.board = new Int8Array(this.board);
      copy.turn = this.turn;
      copy.captures = { [BLACK]: this.captures[BLACK], [WHITE]: this.captures[WHITE] };
      copy.koPoint = this.koPoint ? { ...this.koPoint } : null;
      copy.lastMove = this.lastMove ? { ...this.lastMove } : null;
      copy.consecutivePasses = this.consecutivePasses;
      copy.moveCount = this.moveCount;
      copy.history = this.history.map((snap) => ({
        board: new Int8Array(snap.board),
        turn: snap.turn,
        captures: { ...snap.captures },
        koPoint: snap.koPoint ? { ...snap.koPoint } : null,
        lastMove: snap.lastMove ? { ...snap.lastMove } : null,
        consecutivePasses: snap.consecutivePasses,
        moveCount: snap.moveCount
      }));
      return copy;
    }

    _pushHistory() {
      this.history.push({
        board: new Int8Array(this.board),
        turn: this.turn,
        captures: { ...this.captures },
        koPoint: this.koPoint ? { ...this.koPoint } : null,
        lastMove: this.lastMove ? { ...this.lastMove } : null,
        consecutivePasses: this.consecutivePasses,
        moveCount: this.moveCount
      });
    }

    reset(size = this.size) {
      this.size = size;
      this.board = new Int8Array(size * size);
      this.turn = BLACK;
      this.captures = { [BLACK]: 0, [WHITE]: 0 };
      this.koPoint = null;
      this.history = [];
      this.lastMove = null;
      this.consecutivePasses = 0;
      this.moveCount = 0;
    }

    setPosition(stones, turn = BLACK) {
      this.reset(this.size);
      this.turn = turn;
      if (stones && Array.isArray(stones.black)) {
        for (const [x, y] of stones.black) {
          if (this.inBounds(x, y)) this.set(x, y, BLACK);
        }
      }
      if (stones && Array.isArray(stones.white)) {
        for (const [x, y] of stones.white) {
          if (this.inBounds(x, y)) this.set(x, y, WHITE);
        }
      }
    }

    setupHandicap(count = 0) {
      this.reset(this.size);
      const pts = getHandicapPoints(this.size, count);
      if (pts.length >= 2) {
        for (const [x, y] of pts) {
          if (this.inBounds(x, y)) this.set(x, y, BLACK);
        }
        this.turn = WHITE;
      } else {
        this.turn = BLACK;
      }
      return pts;
    }

    getGroup(x, y, boardRef = this.board) {
      if (!this.inBounds(x, y)) return null;
      const color = boardRef[this.idx(x, y)];
      if (color === EMPTY) return null;

      const visited = new Uint8Array(this.size * this.size);
      const libVisited = new Uint8Array(this.size * this.size);
      const stones = [];
      const liberties = [];
      const stack = [{ x, y }];
      visited[this.idx(x, y)] = 1;

      while (stack.length > 0) {
        const cur = stack.pop();
        stones.push(cur);
        for (const nb of this.neighbors(cur.x, cur.y)) {
          const nIdx = this.idx(nb.x, nb.y);
          const nColor = boardRef[nIdx];
          if (nColor === EMPTY) {
            if (!libVisited[nIdx]) {
              libVisited[nIdx] = 1;
              liberties.push(nb);
            }
          } else if (nColor === color && !visited[nIdx]) {
            visited[nIdx] = 1;
            stack.push(nb);
          }
        }
      }
      return { color, stones, liberties };
    }

    isLegalMove(x, y, color = this.turn) {
      if (!this.inBounds(x, y)) {
        return { legal: false, reason: 'out_of_bounds' };
      }
      if (this.get(x, y) !== EMPTY) {
        return { legal: false, reason: 'occupied' };
      }
      if (this.koPoint && this.koPoint.x === x && this.koPoint.y === y) {
        return { legal: false, reason: 'ko' };
      }

      const sim = new Int8Array(this.board);
      sim[this.idx(x, y)] = color;
      const opp = opponentOf(color);
      const capturedMap = new Uint8Array(this.size * this.size);
      const captures = [];

      for (const nb of this.neighbors(x, y)) {
        if (sim[this.idx(nb.x, nb.y)] === opp) {
          const oppGroup = this.getGroup(nb.x, nb.y, sim);
          if (oppGroup && oppGroup.liberties.length === 0) {
            for (const st of oppGroup.stones) {
              const sIdx = this.idx(st.x, st.y);
              if (!capturedMap[sIdx]) {
                capturedMap[sIdx] = 1;
                captures.push(st);
              }
            }
          }
        }
      }

      for (const cap of captures) {
        sim[this.idx(cap.x, cap.y)] = EMPTY;
      }

      const ownGroup = this.getGroup(x, y, sim);
      if (!ownGroup || ownGroup.liberties.length === 0) {
        return { legal: false, reason: 'suicide' };
      }

      return { legal: true, captures, ownGroupSize: ownGroup.stones.length, ownLiberties: ownGroup.liberties.length };
    }

    playMove(x, y, color = this.turn) {
      const check = this.isLegalMove(x, y, color);
      if (!check.legal) {
        return { ok: false, reason: check.reason };
      }

      this._pushHistory();
      this.set(x, y, color);

      for (const cap of check.captures) {
        this.set(cap.x, cap.y, EMPTY);
      }

      this.captures[color] += check.captures.length;

      // Ko rule: single stone captured by a single-stone group that now has 1 liberty
      if (
        check.captures.length === 1 &&
        check.ownGroupSize === 1 &&
        check.ownLiberties === 1
      ) {
        this.koPoint = { x: check.captures[0].x, y: check.captures[0].y };
      } else {
        this.koPoint = null;
      }

      this.lastMove = { x, y, color };
      this.turn = opponentOf(color);
      this.consecutivePasses = 0;
      this.moveCount += 1;

      return {
        ok: true,
        captured: check.captures,
        lastMove: this.lastMove,
        koPoint: this.koPoint ? { ...this.koPoint } : null
      };
    }

    pass() {
      this._pushHistory();
      const passedBy = this.turn;
      this.koPoint = null;
      this.lastMove = null;
      this.consecutivePasses += 1;
      this.turn = opponentOf(this.turn);
      this.moveCount += 1;
      return { ok: true, passedBy, gameOver: this.consecutivePasses >= 2 };
    }

    undo() {
      if (this.history.length === 0) return false;
      const prev = this.history.pop();
      this.board = prev.board;
      this.turn = prev.turn;
      this.captures = prev.captures;
      this.koPoint = prev.koPoint;
      this.lastMove = prev.lastMove;
      this.consecutivePasses = prev.consecutivePasses;
      this.moveCount = prev.moveCount;
      return true;
    }

    getAllGroups() {
      const visited = new Uint8Array(this.size * this.size);
      const groups = [];
      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const i = this.idx(x, y);
          if (this.board[i] !== EMPTY && !visited[i]) {
            const grp = this.getGroup(x, y);
            for (const st of grp.stones) {
              visited[this.idx(st.x, st.y)] = 1;
            }
            groups.push(grp);
          }
        }
      }
      return groups;
    }

    estimateScore(komi = 6.5) {
      const visited = new Uint8Array(this.size * this.size);
      const territoryMap = new Int8Array(this.size * this.size); // 1=Black, 2=White, 0=neutral/occupied
      let blackTerritory = 0;
      let whiteTerritory = 0;
      let blackStones = 0;
      let whiteStones = 0;

      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const i = this.idx(x, y);
          const c = this.board[i];
          if (c === BLACK) blackStones += 1;
          else if (c === WHITE) whiteStones += 1;
          else if (!visited[i]) {
            const region = [];
            const stack = [{ x, y }];
            visited[i] = 1;
            let touchesBlack = false;
            let touchesWhite = false;

            while (stack.length > 0) {
              const cur = stack.pop();
              region.push(cur);
              for (const nb of this.neighbors(cur.x, cur.y)) {
                const nIdx = this.idx(nb.x, nb.y);
                const nColor = this.board[nIdx];
                if (nColor === BLACK) touchesBlack = true;
                else if (nColor === WHITE) touchesWhite = true;
                else if (!visited[nIdx]) {
                  visited[nIdx] = 1;
                  stack.push(nb);
                }
              }
            }

            if (touchesBlack && !touchesWhite) {
              blackTerritory += region.length;
              for (const pt of region) territoryMap[this.idx(pt.x, pt.y)] = BLACK;
            } else if (touchesWhite && !touchesBlack) {
              whiteTerritory += region.length;
              for (const pt of region) territoryMap[this.idx(pt.x, pt.y)] = WHITE;
            }
          }
        }
      }

      const blackTotal = blackTerritory + this.captures[BLACK];
      const whiteTotal = whiteTerritory + this.captures[WHITE] + komi;
      const blackArea = blackTerritory + blackStones;
      const whiteArea = whiteTerritory + whiteStones + komi;

      return {
        blackTerritory,
        whiteTerritory,
        blackCaptures: this.captures[BLACK],
        whiteCaptures: this.captures[WHITE],
        komi,
        blackTotal,
        whiteTotal,
        blackArea,
        whiteArea,
        winner: blackTotal > whiteTotal ? BLACK : WHITE,
        margin: Math.abs(blackTotal - whiteTotal),
        territoryMap
      };
    }

    _isTrueEyeLike(x, y, color) {
      if (this.get(x, y) !== EMPTY) return false;
      const nbs = this.neighbors(x, y);
      for (const nb of nbs) {
        if (this.get(nb.x, nb.y) !== color) return false;
      }
      // Check diagonals: at least 3 of 4 (or all on edge/corner) owned by color or empty-friendly
      const diags = [
        [x - 1, y - 1],
        [x + 1, y - 1],
        [x - 1, y + 1],
        [x + 1, y + 1]
      ].filter(([dx, dy]) => this.inBounds(dx, dy));

      let enemyDiags = 0;
      const opp = opponentOf(color);
      for (const [dx, dy] of diags) {
        if (this.get(dx, dy) === opp) enemyDiags += 1;
      }
      if (diags.length < 4) return enemyDiags === 0;
      return enemyDiags <= 1;
    }

    _wouldFormEmptyTriangle(x, y, color) {
      // Check the 4 L-triples containing (x,y)
      const pairs = [
        [[x - 1, y], [x, y - 1], [x - 1, y - 1]],
        [[x + 1, y], [x, y - 1], [x + 1, y - 1]],
        [[x - 1, y], [x, y + 1], [x - 1, y + 1]],
        [[x + 1, y], [x, y + 1], [x + 1, y + 1]]
      ];
      for (const [a, b, diag] of pairs) {
        if (!this.inBounds(a[0], a[1]) || !this.inBounds(b[0], b[1]) || !this.inBounds(diag[0], diag[1])) {
          continue;
        }
        if (this.get(a[0], a[1]) === color && this.get(b[0], b[1]) === color && this.get(diag[0], diag[1]) === EMPTY) {
          return true;
        }
      }
      return false;
    }

    _wouldFormBambooOrTiger(x, y, color) {
      // Tiger's mouth: 2 diagonal friendly stones flanking a 3rd friendly orthogonal stone across an empty mouth
      let bonus = 0;
      const diagDirs = [
        [x - 1, y - 1],
        [x + 1, y - 1],
        [x - 1, y + 1],
        [x + 1, y + 1]
      ];
      let diagFriends = 0;
      for (const [dx, dy] of diagDirs) {
        if (this.inBounds(dx, dy) && this.get(dx, dy) === color) diagFriends += 1;
      }
      if (diagFriends >= 2) bonus += 10;

      // Bamboo joint completion: adjacent friendly stone + parallel pair 1 space away
      const shifts = [
        [[1, 0], [0, 1], [1, 1]],
        [[-1, 0], [0, 1], [-1, 1]],
        [[0, 1], [1, 0], [1, 1]],
        [[0, -1], [1, 0], [1, -1]]
      ];
      for (const [s1, s2, s3] of shifts) {
        if (
          this.get(x + s1[0], y + s1[1]) === color &&
          this.get(x + s2[0], y + s2[1]) === EMPTY &&
          this.get(x + s3[0], y + s3[1]) === color
        ) {
          bonus += 7;
          break;
        }
      }
      return bonus;
    }

    _scoreCandidateMove(x, y, color, rankCfg, starKeys) {
      const check = this.isLegalMove(x, y, color);
      if (!check.legal) return -9999;

      // Never fill own true eye unless capturing
      if (check.captures.length === 0 && this._isTrueEyeLike(x, y, color)) {
        return -9999;
      }

      const opp = opponentOf(color);
      const edgeMax = this.size - 1;
      let score = 0;

      // 1. Captures
      if (check.captures.length > 0) {
        score += 105 + check.captures.length * 42;
      }

      // 2. Saving Atari, Double Atari & cutting/connecting
      let savedOwn = 0;
      let atariCount = 0;
      let putOppInAtari = 0;
      let friendlyAdj = 0;
      let enemyAdj = 0;

      for (const nb of this.neighbors(x, y)) {
        const c = this.get(nb.x, nb.y);
        if (c === color) {
          friendlyAdj += 1;
          const grp = this.getGroup(nb.x, nb.y);
          if (grp && grp.liberties.length === 1) {
            savedOwn += grp.stones.length;
          }
        } else if (c === opp) {
          enemyAdj += 1;
          const grp = this.getGroup(nb.x, nb.y);
          if (grp && grp.liberties.length === 2) {
            atariCount += 1;
            putOppInAtari += grp.stones.length;
          }
        }
      }

      if (savedOwn > 0 && check.ownLiberties >= 2) {
        score += 78 + savedOwn * 28;
      }
      if (putOppInAtari > 0 && check.ownLiberties >= 2) {
        score += 32 + putOppInAtari * 12;
        if (atariCount >= 2) score += 68; // Double Atari!
      }

      // 3. Penalize self-atari unless it captures
      if (check.ownLiberties === 1 && check.captures.length === 0) {
        score -= 72 + check.ownGroupSize * 18;
      }

      // 4. Opening / positional value
      const lineX = Math.min(x, edgeMax - x) + 1;
      const lineY = Math.min(y, edgeMax - y) + 1;
      const minLine = Math.min(lineX, lineY);
      const isOpening = this.moveCount < (this.size >= 19 ? 28 : 12);

      if (isOpening) {
        if (starKeys.has(`${x},${y}`)) score += 24;
        if ((lineX === 3 || lineX === 4) && (lineY === 3 || lineY === 4)) score += 18;
        else if (minLine === 3 || minLine === 4) score += 11;
        else if (minLine === 1) score -= 22;
        else if (minLine === 2) score -= 6;
      } else {
        if (minLine === 1) score -= 9;
        else if (minLine === 2) score -= 2;
        else if (minLine === 3 || minLine === 4) score += 5;
      }

      // 5. Local contact & 3x3 shape quality (stronger for Dan ranks)
      if (enemyAdj > 0 && friendlyAdj > 0) score += 14;
      else if (enemyAdj > 0) score += 6;
      else if (friendlyAdj === 1) score += 5;
      else if (friendlyAdj >= 3) score -= 12;

      if (rankCfg.lookahead >= 1) {
        if (this._wouldFormEmptyTriangle(x, y, color) && savedOwn === 0 && check.captures.length === 0) {
          score -= 16;
        }
        score += this._wouldFormBambooOrTiger(x, y, color);
      }

      // 6. Proximity / Knight's jump to last move
      if (this.lastMove) {
        const dist = Math.abs(this.lastMove.x - x) + Math.abs(this.lastMove.y - y);
        if (dist === 2) score += 9;
        else if (dist === 3) score += 8;
        else if (dist === 4) score += 4;
      }

      score += (Math.random() - 0.5) * rankCfg.noise;
      return score;
    }

    _evaluateBoardHeuristic(perspectiveColor, komi = 6.5) {
      const sc = this.estimateScore(komi);
      // Combine territory + area + captures + group liberty health
      const terrDiff =
        perspectiveColor === BLACK
          ? sc.blackTotal - sc.whiteTotal
          : sc.whiteTotal - sc.blackTotal;
      const areaDiff =
        perspectiveColor === BLACK
          ? sc.blackArea - sc.whiteArea
          : sc.whiteArea - sc.blackArea;

      let libScore = 0;
      const opp = opponentOf(perspectiveColor);
      for (const grp of this.getAllGroups()) {
        const libs = grp.liberties.length;
        const val = grp.stones.length;
        if (grp.color === perspectiveColor) {
          if (libs === 1) libScore -= val * 2.2;
          else if (libs === 2) libScore -= val * 0.5;
          else libScore += Math.min(6, libs) * 0.35;
        } else if (grp.color === opp) {
          if (libs === 1) libScore += val * 2.0;
          else if (libs === 2) libScore += val * 0.45;
          else libScore -= Math.min(6, libs) * 0.3;
        }
      }

      return terrDiff * 0.65 + areaDiff * 0.35 + libScore;
    }

    _runFastPlayout(sim, perspectiveColor, komi, maxSteps) {
      const size = sim.size;
      const totalCells = size * size;
      let passes = 0;

      for (let step = 0; step < maxSteps; step++) {
        const turn = sim.turn;
        let chosen = null;

        // Bias 1: quick local tactical check near lastMove
        if (sim.lastMove) {
          const lx = sim.lastMove.x;
          const ly = sim.lastMove.y;
          let bestLocal = null;
          let bestLocalScore = -999;
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = lx + dx;
              const ny = ly + dy;
              if (!sim.inBounds(nx, ny)) continue;
              const chk = sim.isLegalMove(nx, ny, turn);
              if (!chk.legal) continue;
              if (chk.captures.length === 0 && sim._isTrueEyeLike(nx, ny, turn)) continue;
              let s = chk.captures.length * 40 + (chk.ownLiberties === 1 && chk.captures.length === 0 ? -35 : 0);
              s += Math.random() * 14;
              if (s > bestLocalScore) {
                bestLocalScore = s;
                bestLocal = { x: nx, y: ny };
              }
            }
          }
          if (bestLocal && bestLocalScore > 20) {
            chosen = bestLocal;
          }
        }

        // Bias 2: sample random legal non-eye, non-self-atari points
        if (!chosen) {
          for (let tries = 0; tries < 14; tries++) {
            const idx = Math.floor(Math.random() * totalCells);
            const x = idx % size;
            const y = Math.floor(idx / size);
            const chk = sim.isLegalMove(x, y, turn);
            if (!chk.legal) continue;
            if (chk.captures.length === 0 && sim._isTrueEyeLike(x, y, turn)) continue;
            if (chk.ownLiberties === 1 && chk.captures.length === 0 && tries < 10) continue;
            chosen = { x, y };
            break;
          }
        }

        if (chosen) {
          sim.playMove(chosen.x, chosen.y, turn);
          passes = 0;
        } else {
          sim.pass();
          passes += 1;
          if (passes >= 2) break;
        }
      }

      return sim._evaluateBoardHeuristic(perspectiveColor, komi);
    }

    getBotMove(color = this.turn, rankId = '1d', komi = 6.5) {
      const rankCfg = getRankConfig(rankId);
      const starKeys = new Set(getStarPoints(this.size).map((p) => `${p.x},${p.y}`));
      const candidates = [];

      for (let y = 0; y < this.size; y++) {
        for (let x = 0; x < this.size; x++) {
          const score = this._scoreCandidateMove(x, y, color, rankCfg, starKeys);
          if (score > -500) {
            candidates.push({ x, y, score });
          }
        }
      }

      if (candidates.length === 0) return null;
      candidates.sort((a, b) => b.score - a.score);
      if (candidates[0].score < -18) return null;

      // 20k: friendly beginner mode picks randomly among top few reasonable candidates
      if (rankCfg.topPool > 1) {
        const pool = candidates.slice(0, Math.min(rankCfg.topPool, candidates.length)).filter((c) => c.score > -12);
        if (pool.length === 0) return { x: candidates[0].x, y: candidates[0].y };
        const pick = pool[Math.floor(Math.random() * pool.length)];
        return { x: pick.x, y: pick.y };
      }

      // 10k: pure fast heuristic
      if (rankCfg.lookahead === 0) {
        return { x: candidates[0].x, y: candidates[0].y };
      }

      // 1D+: 1-ply opponent counter-capture safety + tactical check
      const opp = opponentOf(color);
      const topK = candidates.slice(0, Math.min(rankCfg.rollouts > 0 ? 10 : 6, candidates.length));
      const evaluated = [];

      for (const cand of topK) {
        const sim = this.clone();
        const r = sim.playMove(cand.x, cand.y, color);
        if (!r.ok) continue;

        let adjScore = cand.score;

        // Check if our placed group is now in Atari and opponent can capture immediately
        const placedGrp = sim.getGroup(cand.x, cand.y);
        if (placedGrp && placedGrp.liberties.length === 1) {
          const lib = placedGrp.liberties[0];
          const oppChk = sim.isLegalMove(lib.x, lib.y, opp);
          if (oppChk.legal && oppChk.captures.length >= placedGrp.stones.length) {
            adjScore -= 55 + placedGrp.stones.length * 16;
          }
        }

        // 2-ply heuristic check for 3D+: examine opponent's sharpest reply
        if (rankCfg.lookahead >= 2) {
          let bestOppGain = 0;
          for (const nb of sim.neighbors(cand.x, cand.y)) {
            if (sim.get(nb.x, nb.y) === EMPTY) {
              const chk = sim.isLegalMove(nb.x, nb.y, opp);
              if (chk.legal && chk.captures.length > 0) {
                bestOppGain = Math.max(bestOppGain, chk.captures.length * 26);
              }
            }
          }
          adjScore -= bestOppGain * 0.7;
          adjScore += sim._evaluateBoardHeuristic(color, komi) * 0.25;
        }

        evaluated.push({ x: cand.x, y: cand.y, baseScore: adjScore, visits: 0, totalVal: 0 });
      }

      if (evaluated.length === 0) return { x: candidates[0].x, y: candidates[0].y };
      evaluated.sort((a, b) => b.baseScore - a.baseScore);

      // Pure 1D stops after 1-ply safety filtering
      if (rankCfg.rollouts <= 0) {
        return { x: evaluated[0].x, y: evaluated[0].y };
      }

      // 3D–9D: Time-boxed UCB1 Monte Carlo Playout Search
      const startMs = Date.now();
      const playoutDepth = this.size >= 19 ? 22 : this.size >= 13 ? 26 : 28;
      let totalVisits = 0;

      for (let i = 0; i < rankCfg.rollouts; i++) {
        if (i >= evaluated.length && Date.now() - startMs >= rankCfg.maxMs) {
          break;
        }

        // Pick arm via UCB1 (explore every top candidate once first)
        let arm;
        if (i < evaluated.length) {
          arm = evaluated[i];
        } else {
          let bestUcb = -Infinity;
          const logN = Math.log(totalVisits + 1);
          for (const item of evaluated) {
            const mean = item.totalVal / item.visits;
            const prior = item.baseScore * 0.08;
            const ucb = mean + prior + 12 * Math.sqrt(logN / item.visits);
            if (ucb > bestUcb) {
              bestUcb = ucb;
              arm = item;
            }
          }
        }

        const sim = this.clone();
        sim.playMove(arm.x, arm.y, color);
        const val = sim._runFastPlayout(sim, color, komi, playoutDepth);
        arm.visits += 1;
        arm.totalVal += val;
        totalVisits += 1;
      }

      // Combine MCTS rollout average + heuristic prior
      let bestMove = evaluated[0];
      let bestFinal = -Infinity;
      for (const item of evaluated) {
        const mctsMean = item.visits > 0 ? item.totalVal / item.visits : 0;
        const combined = mctsMean + item.baseScore * 0.22;
        if (combined > bestFinal) {
          bestFinal = combined;
          bestMove = item;
        }
      }

      return { x: bestMove.x, y: bestMove.y };
    }

    getSmartBotMove(color = this.turn) {
      return this.getBotMove(color, '10k', 6.5);
    }
  }

  const exportsObj = {
    EMPTY,
    BLACK,
    WHITE,
    COLUMNS,
    BOT_RANKS,
    getRankConfig,
    getHandicapPoints,
    opponentOf,
    coordToString,
    stringToCoord,
    getStarPoints,
    GoEngine
  };

  root.GoAcademy = root.GoAcademy || {};
  Object.assign(root.GoAcademy, exportsObj);

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObj;
  }
})(typeof window !== 'undefined' ? window : globalThis);
