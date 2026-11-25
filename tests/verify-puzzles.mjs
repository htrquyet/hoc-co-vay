import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const {
  EMPTY,
  BLACK,
  WHITE,
  BOT_RANKS,
  getHandicapPoints,
  coordToString,
  stringToCoord,
  getStarPoints,
  GoEngine
} = require('../js/go-engine.js');
const { ROADMAP_STAGES, LESSONS, GLOSSARY } = require('../js/curriculum-data.js');
const { BOARD_SKINS, getSkinById, GobanRenderer } = require('../js/goban-renderer.js');
const { MUSIC_TRACKS, ACOUSTIC_PROFILES, GoAudioEngine } = require('../js/audio-engine.js');

function checkNoDeadInitialStones(engine, label) {
  const groups = engine.getAllGroups();
  for (const grp of groups) {
    assert.ok(
      grp.liberties.length > 0,
      `${label}: Found initial stone group with 0 liberties at (${grp.stones[0].x},${grp.stones[0].y})`
    );
  }
}

function checkNoDuplicateCoords(pos, label) {
  const seen = new Set();
  for (const [x, y] of pos.black || []) {
    const k = `${x},${y}`;
    assert.ok(!seen.has(k), `${label}: Duplicate black coord at ${k}`);
    seen.add(k);
  }
  for (const [x, y] of pos.white || []) {
    const k = `${x},${y}`;
    assert.ok(!seen.has(k), `${label}: Overlapping/duplicate white coord at ${k}`);
    seen.add(k);
  }
}

console.log('1. Testing GoEngine core rules...');

// Coordinate helpers
assert.equal(coordToString(0, 0, 9), 'A9');
assert.equal(coordToString(8, 8, 9), 'J1'); // skips I
assert.deepEqual(stringToCoord('Q16', 19), { x: 15, y: 3 });
assert.equal(getStarPoints(19).length, 9);

// Liberties: center 4, edge 3, corner 2
{
  const e = new GoEngine(9);
  e.setPosition({ black: [[4, 4], [4, 0], [0, 0]], white: [] });
  assert.equal(e.getGroup(4, 4).liberties.length, 4);
  assert.equal(e.getGroup(4, 0).liberties.length, 3);
  assert.equal(e.getGroup(0, 0).liberties.length, 2);
}

// Single capture & suicide check & suicide-with-capture exception
{
  const e = new GoEngine(9);
  e.setPosition({ black: [[1, 0], [0, 1]], white: [[0, 0]] }, WHITE);
  // White playing elsewhere first? Let's test White cannot suicide at (0,0) if surrounded:
  e.setPosition({ black: [[1, 0], [0, 1]], white: [] }, WHITE);
  const sui = e.isLegalMove(0, 0, WHITE);
  assert.equal(sui.legal, false);
  assert.equal(sui.reason, 'suicide');

  // Black capturing White at (0,1) when B(1,0), W(0,0)
  e.setPosition({ black: [[1, 0]], white: [[0, 0]] }, BLACK);
  const cap = e.playMove(0, 1, BLACK);
  assert.equal(cap.ok, true);
  assert.equal(cap.captured.length, 1);
  assert.equal(e.get(0, 0), EMPTY);
  assert.equal(e.captures[BLACK], 1);
}

// Ko rule & release after unrelated move & undo
{
  const e = new GoEngine(9);
  e.setPosition({ black: [[3, 4], [4, 3], [4, 5]], white: [[4, 4], [5, 3], [5, 5], [6, 4]] }, BLACK);
  const m1 = e.playMove(5, 4, BLACK);
  assert.equal(m1.ok, true);
  assert.equal(m1.captured.length, 1);
  assert.deepEqual(m1.koPoint, { x: 4, y: 4 });

  // White cannot immediately recapture at (4,4)
  const koBlocked = e.playMove(4, 4, WHITE);
  assert.equal(koBlocked.ok, false);
  assert.equal(koBlocked.reason, 'ko');

  // White plays elsewhere, Black plays elsewhere -> White can now capture at (4,4)
  assert.equal(e.playMove(0, 0, WHITE).ok, true);
  assert.equal(e.playMove(0, 1, BLACK).ok, true);
  const koOk = e.playMove(4, 4, WHITE);
  assert.equal(koOk.ok, true);
  assert.equal(koOk.captured.length, 1);

  // Undo restores board
  assert.equal(e.undo(), true);
  assert.equal(e.get(5, 4), BLACK);
}

// Territory estimation
{
  const e = new GoEngine(9);
  // Black walls column x=2, White walls column x=6
  const blacks = [];
  const whites = [];
  for (let y = 0; y < 9; y++) {
    blacks.push([2, y]);
    whites.push([6, y]);
  }
  e.setPosition({ black: blacks, white: whites });
  const sc = e.estimateScore(6.5);
  assert.equal(sc.blackTerritory, 18);
  assert.equal(sc.whiteTerritory, 18);
  assert.equal(sc.winner, WHITE); // Komi 6.5 breaks tie
}

// Smart bot & 7 Dan ranks + Handicap system
assert.deepEqual(BOT_RANKS.map((r) => r.id), ['20k', '10k', '1d', '3d', '4d', '6d', '9d']);
{
  for (const sz of [9, 13, 19]) {
    for (const h of [2, 3, 4, 5, 9]) {
      const e = new GoEngine(sz);
      const pts = e.setupHandicap(h);
      assert.equal(pts.length, h, `Expected ${h} handicap stones on ${sz}x${sz}`);
      assert.equal(e.turn, WHITE, 'Handicap game must start on White turn');
    }
  }

  // Test all 7 ranks return legal moves & higher ranks find obvious Atari capture
  for (const rank of BOT_RANKS) {
    const e = new GoEngine(9);
    e.setPosition({ black: [[3, 4], [5, 4], [4, 3]], white: [[4, 4]] }, BLACK);
    const mv = e.getBotMove(BLACK, rank.id, 6.5);
    assert.ok(mv && e.isLegalMove(mv.x, mv.y, BLACK).legal, `Rank ${rank.id} returned illegal move`);
    if (['10k', '1d', '3d', '4d', '6d', '9d'].includes(rank.id)) {
      assert.deepEqual(mv, { x: 4, y: 5 }, `Rank ${rank.id} should capture Atari stone at (4,5)`);
    }
  }

  // Verify 9D completes within time budget on 19x19
  const e19 = new GoEngine(19);
  e19.setupHandicap(4);
  const t0 = Date.now();
  const mv19 = e19.getBotMove(WHITE, '9d', 0.5);
  const elapsed = Date.now() - t0;
  assert.ok(mv19 && e19.isLegalMove(mv19.x, mv19.y, WHITE).legal, '9D 19x19 move must be legal');
  assert.ok(elapsed < 1500, `9D 19x19 took too long: ${elapsed}ms`);
}

console.log('✓ GoEngine core rules passed!');
console.log(`2. Validating ${ROADMAP_STAGES.length} stages, ${LESSONS.length} lessons, and ${GLOSSARY.length} glossary terms...`);

assert.equal(ROADMAP_STAGES.length, 6);
assert.equal(LESSONS.length, 24);

const stageIds = new Set(ROADMAP_STAGES.map((s) => s.id));
const lessonIds = new Set(LESSONS.map((l) => l.id));

for (const term of GLOSSARY) {
  assert.ok(lessonIds.has(term.lessonId), `Glossary term "${term.term}" references missing lesson ${term.lessonId}`);
}

const tacticalOutcomes = {};

for (const lesson of LESSONS) {
  assert.ok(stageIds.has(lesson.stageId), `${lesson.id}: invalid stageId`);
  assert.ok([9, 13, 19].includes(lesson.boardSize), `${lesson.id}: invalid boardSize`);
  assert.ok(lesson.theoryHtml && lesson.theoryHtml.trim().length > 20, `${lesson.id}: missing theoryHtml`);
  assert.ok(Array.isArray(lesson.demoSteps) && lesson.demoSteps.length > 0, `${lesson.id}: missing demoSteps`);

  // Validate demo sequence
  const demoPos = lesson.demoInitialPosition || lesson.puzzle.initialPosition;
  checkNoDuplicateCoords(demoPos, `${lesson.id} demoInitialPosition`);
  const demoEngine = new GoEngine(lesson.boardSize);
  demoEngine.setPosition(demoPos, BLACK);
  checkNoDeadInitialStones(demoEngine, `${lesson.id} demoInitialPosition`);

  for (let sIdx = 0; sIdx < lesson.demoSteps.length; sIdx++) {
    const step = lesson.demoSteps[sIdx];
    assert.ok(step.caption && step.caption.trim().length > 0, `${lesson.id} demo step ${sIdx} missing caption`);
    if (Array.isArray(step.moves)) {
      for (const mv of step.moves) {
        const res = demoEngine.playMove(mv.x, mv.y, mv.color);
        assert.equal(
          res.ok,
          true,
          `${lesson.id} demo step ${sIdx} illegal move (${mv.x},${mv.y}) color=${mv.color}: ${res.reason}`
        );
      }
    }
  }

  // Validate puzzle initialPosition & full recursive tree
  const p = lesson.puzzle;
  checkNoDuplicateCoords(p.initialPosition, `${lesson.id} puzzle.initialPosition`);
  const baseEngine = new GoEngine(lesson.boardSize);
  baseEngine.setPosition(p.initialPosition, p.playerColor || BLACK);
  checkNoDeadInitialStones(baseEngine, `${lesson.id} puzzle.initialPosition`);

  let solvedCount = 0;
  let totalBranches = 0;

  function walkTree(engineState, treeNode, pathDesc) {
    const entries = Object.entries(treeNode || {});
    assert.ok(entries.length > 0, `${lesson.id}: empty tree node at ${pathDesc}`);
    for (const [coordKey, branch] of entries) {
      totalBranches += 1;
      const [px, py] = coordKey.split(',').map(Number);
      const branchEngine = engineState.clone();
      const playerColor = p.playerColor || BLACK;
      const oppColor = playerColor === BLACK ? WHITE : BLACK;

      const mvRes = branchEngine.playMove(px, py, playerColor);
      assert.equal(
        mvRes.ok,
        true,
        `${lesson.id} puzzle ${pathDesc} -> player move (${coordKey}) illegal: ${mvRes.reason}`
      );

      if (branch.status === 'solved') {
        solvedCount += 1;
        tacticalOutcomes[lesson.id] = tacticalOutcomes[lesson.id] || [];
        tacticalOutcomes[lesson.id].push({
          capturedTotal: branchEngine.captures[playerColor],
          koPoint: mvRes.koPoint
        });
      } else if (branch.status === 'wrong') {
        if (Array.isArray(branch.reply)) {
          const [rx, ry] = branch.reply;
          const oppRes = branchEngine.playMove(rx, ry, oppColor);
          assert.equal(
            oppRes.ok,
            true,
            `${lesson.id} puzzle ${pathDesc} -> wrong reply (${rx},${ry}) illegal: ${oppRes.reason}`
          );
        }
      } else if (branch.status === 'continue') {
        assert.ok(Array.isArray(branch.reply), `${lesson.id} continue branch at ${coordKey} missing reply`);
        const [rx, ry] = branch.reply;
        const oppRes = branchEngine.playMove(rx, ry, oppColor);
        assert.equal(
          oppRes.ok,
          true,
          `${lesson.id} puzzle ${pathDesc} -> continue reply (${rx},${ry}) illegal: ${oppRes.reason}`
        );
        walkTree(branchEngine, branch.next, `${pathDesc}->${coordKey}/${rx},${ry}`);
      } else {
        assert.fail(`${lesson.id}: unknown branch status "${branch.status}"`);
      }
    }
  }

  walkTree(baseEngine, p.tree, 'root');
  assert.ok(solvedCount >= 1, `${lesson.id}: puzzle has no solved leaf!`);
  console.log(`  ✓ ${lesson.code} ${lesson.title} (${lesson.boardSize}x${lesson.boardSize}, ${totalBranches} branches, ${solvedCount} winning line(s))`);
}

// Key tactical assertions
assert.ok(tacticalOutcomes['lesson-1-1'].some((o) => o.capturedTotal === 1), '1.1 should capture 1 stone');
assert.ok(tacticalOutcomes['lesson-1-2'].some((o) => o.capturedTotal === 1), '1.2 should capture 1 stone');
assert.ok(tacticalOutcomes['lesson-1-4'].some((o) => o.capturedTotal === 1 && o.koPoint && o.koPoint.x === 4 && o.koPoint.y === 4), '1.4 should create Ko at (4,4)');
assert.ok(tacticalOutcomes['lesson-2-2'].some((o) => o.capturedTotal === 1), '2.2 Double Atari should capture 1 stone');
assert.ok(tacticalOutcomes['lesson-2-3'].some((o) => o.capturedTotal === 4), '2.3 Ladder should capture 4 stones');
assert.ok(tacticalOutcomes['lesson-2-4'].some((o) => o.capturedTotal === 3), '2.4 Net should capture 3 stones');
assert.ok(tacticalOutcomes['lesson-2-5'].some((o) => o.capturedTotal === 7), '2.5 Snapback should capture 7 stones');
assert.ok(tacticalOutcomes['lesson-2-6'].some((o) => o.capturedTotal === 6), '2.6 Semeai should capture 6 stones');
assert.ok(tacticalOutcomes['lesson-4-4'].some((o) => o.capturedTotal === 1), '4.4 Tiger Mouth should capture cutting stone');

console.log('3. Checking index.html assets and DOM ID bindings...');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const appJs = fs.readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
for (const match of html.matchAll(/(?:src|href)="((?:css|js)\/[^"]+)"/g)) {
  const assetUrl = new URL('../' + match[1], import.meta.url);
  assert.ok(fs.existsSync(assetUrl), `Missing asset referenced in index.html: ${match[1]}`);
}
const domIds = [...new Set([...appJs.matchAll(/getElementById\('([^']+)'\)/g)].map((m) => m[1]))];
assert.ok(domIds.length > 20, 'Expected app.js DOM bindings');
for (const id of domIds) {
  assert.ok(html.includes(`id="${id}"`), `app.js references missing HTML id="${id}"`);
}
for (const tabName of ['roadmap', 'trainer', 'sandbox', 'glossary']) {
  assert.ok(
    html.includes(`class="bottom-nav-btn`) && html.includes(`data-tab="${tabName}"`),
    `Missing mobile bottom nav button for tab ${tabName}`
  );
}
for (const method of ['setTouchConfirm', 'getPendingMove', 'clearPendingMove', 'confirmPendingMove', 'setSkin']) {
  assert.equal(typeof GobanRenderer.prototype[method], 'function', `Missing GobanRenderer.${method}`);
}
assert.equal(BOARD_SKINS.length, 6, 'Expected 6 board skins');
for (const sk of BOARD_SKINS) {
  assert.ok(ACOUSTIC_PROFILES[sk.acousticProfile], `Missing acousticProfile for skin ${sk.id}`);
  assert.equal(getSkinById(sk.id).id, sk.id);
}
assert.equal(MUSIC_TRACKS.length, 3, 'Expected 3 Zen music tracks');
const audioTest = new GoAudioEngine();
audioTest.setAcousticProfile('stone-jade');
audioTest.setSfxVolume(0.7);
audioTest.setMusicVolume(0.4);
audioTest.playStone();
audioTest.playCapture(3);
audioTest.playPreviewTick();
audioTest.playSolved();
audioTest.playSoftError();
audioTest.setRainEnabled(true, false);
audioTest.setRainEnabled(false, false);
audioTest.setMusicTrack('wind-chime');
audioTest.setMusicTrack('rain-dojo');
audioTest.setMusicEnabled(true, false);
audioTest.setMusicEnabled(false, false);

// Lightweight mock AudioContext to verify Web Audio graph & seamless rain buffer math
{
  const makeParam = (init = 0) => ({
    value: init,
    setValueAtTime() {},
    linearRampToValueAtTime() {},
    exponentialRampToValueAtTime() {},
    setTargetAtTime() {},
    cancelScheduledValues() {}
  });
  const makeNode = () => ({ connect() {}, disconnect() {}, start() {}, stop() {} });
  class MockAudioContext {
    constructor() {
      this.sampleRate = 48000;
      this.currentTime = 0;
      this.state = 'running';
      this.destination = makeNode();
    }
    resume() { return Promise.resolve(); }
    createGain() { return { ...makeNode(), gain: makeParam(1) }; }
    createBiquadFilter() { return { ...makeNode(), type: 'lowpass', frequency: makeParam(1000), Q: makeParam(1), gain: makeParam(0) }; }
    createOscillator() { return { ...makeNode(), type: 'sine', frequency: makeParam(440) }; }
    createStereoPanner() { return { ...makeNode(), pan: makeParam(0) }; }
    createConvolver() { return { ...makeNode(), buffer: null }; }
    createBuffer(channels, length, sampleRate) {
      const chs = Array.from({ length: channels }, () => new Float32Array(length));
      return { numberOfChannels: channels, length, sampleRate, getChannelData: (c) => chs[c] };
    }
    createBufferSource() { return { ...makeNode(), buffer: null, loop: false }; }
  }
  const sim = new GoAudioEngine({ musicEnabled: true, rainEnabled: true });
  sim._getAudioContextCtor = () => MockAudioContext;
  sim.unlock();
  sim.playStone({ isCapture: true, captureCount: 2 });
  sim.playPreviewTick();
  sim.playSolved();
  sim.playSoftError();
  sim.setMusicTrack('wind-chime');
  sim.setMusicTrack('rain-dojo');
  sim.setMusicEnabled(false, true);
  sim.setRainEnabled(false, true);
  assert.ok(sim._rainBuffer && sim._rainBuffer.length === 480000, 'Expected 10s seamless rain buffer');
  const ch0 = sim._rainBuffer.getChannelData(0);
  let maxVal = 0;
  for (let i = 0; i < ch0.length; i += 100) {
    assert.ok(Number.isFinite(ch0[i]), 'Rain buffer contains non-finite sample');
    if (Math.abs(ch0[i]) > maxVal) maxVal = Math.abs(ch0[i]);
  }
  assert.ok(maxVal > 0 && maxVal < 0.8, `Unexpected rain buffer peak ${maxVal}`);
}

const css = fs.readFileSync(new URL('../css/styles.css', import.meta.url), 'utf8');
assert.ok(
  css.includes('.mobile-bottom-nav') && css.includes('.trainer-sidebar.open') && css.includes('.studio-panel'),
  'Missing mobile responsive or studio CSS rules'
);
console.log(`✓ Verified ${domIds.length} DOM ID bindings, 6 board skins, ASMR/Zen audio engine, and all local assets!`);

console.log('\nALL TESTS PASSED! Engine, UI bindings, and all 24 interactive lessons/puzzles are verified.');
