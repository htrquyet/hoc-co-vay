(function (root) {
  'use strict';

  const {
    BLACK,
    WHITE,
    BOT_RANKS,
    getRankConfig,
    GoEngine,
    GobanRenderer,
    BOARD_SKINS,
    getSkinById,
    GoAudioEngine,
    ROADMAP_STAGES,
    LESSONS,
    GLOSSARY
  } = root.GoAcademy;

  const STORAGE_KEY = 'go_academy_progress_v1';

  const ICONS = {
    soundOn:
      '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
    soundOff:
      '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M23 9l-6 6M17 9l6 6"/></svg>',
    musicOn:
      '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    musicOff:
      '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/><path d="M2 2l20 20"/></svg>',
    moon:
      '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
    sun:
      '<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
  };

  function isCoarsePointerDevice() {
    return (
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches
    );
  }

  const state = {
    activeTab: 'roadmap',
    solvedLessons: new Set(),
    theme: 'light',
    touchConfirm: false,
    // Audio & Skin
    boardSkin: 'kaya',
    sfxEnabled: true,
    sfxVolume: 0.8,
    musicEnabled: false,
    musicTrack: 'koto-zen',
    musicVolume: 0.45,
    rainEnabled: false,
    // Trainer
    lessonFilter: 'all',
    currentLessonId: LESSONS[0].id,
    trainerMode: 'demo',
    demoVariationIndex: 0,
    demoStepIndex: 0,
    demoTimer: null,
    trainerShowLiberties: false,
    trainerZoomed: true,
    puzzleNode: null,
    puzzleLocked: false,
    lastWrongCoord: null,
    theoryExpanded: !isCoarsePointerDevice(),
    // Sandbox
    sandboxSize: 9,
    sandboxMode: 'bot',
    botRank: '1d',
    playerColor: BLACK,
    handicap: 0,
    sandboxShowLiberties: false,
    sandboxShowScore: false,
    sandboxPhase: 'playing',
    sandboxScoreRule: 'japanese',
    sandboxDeadMap: null,
    lastPlayerBeforeEngine: null,
    lastPlayerMove: null,
    coachActive: false,
    botThinking: false,
    // Glossary
    glossaryQuery: '',
    glossaryCat: 'all'
  };

  const audio = new GoAudioEngine();
  let trainerEngine = new GoEngine(9);
  let trainerRenderer = null;
  let sandboxEngine = new GoEngine(9);
  let sandboxRenderer = null;

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.solvedLessons)) {
        state.solvedLessons = new Set(parsed.solvedLessons);
      }
      if (typeof parsed.soundEnabled === 'boolean') {
        state.sfxEnabled = parsed.soundEnabled;
      }
      if (typeof parsed.sfxEnabled === 'boolean') {
        state.sfxEnabled = parsed.sfxEnabled;
      }
      if (typeof parsed.sfxVolume === 'number') {
        state.sfxVolume = parsed.sfxVolume;
      }
      if (typeof parsed.musicEnabled === 'boolean') {
        state.musicEnabled = parsed.musicEnabled;
      }
      if (typeof parsed.musicTrack === 'string') {
        state.musicTrack = parsed.musicTrack;
      }
      if (typeof parsed.musicVolume === 'number') {
        state.musicVolume = parsed.musicVolume;
      }
      if (typeof parsed.rainEnabled === 'boolean') {
        state.rainEnabled = parsed.rainEnabled;
      }
      if (typeof parsed.boardSkin === 'string') {
        state.boardSkin = getSkinById(parsed.boardSkin).id;
      }
      if (typeof parsed.botRank === 'string' && BOT_RANKS.some((r) => r.id === parsed.botRank)) {
        state.botRank = parsed.botRank;
      }
      if (parsed.playerColor === BLACK || parsed.playerColor === WHITE) {
        state.playerColor = parsed.playerColor;
      }
      if ([0, 2, 3, 4, 5, 9].includes(parsed.handicap)) {
        state.handicap = parsed.handicap;
      }
      if (parsed.theme === 'dark' || parsed.theme === 'light') {
        state.theme = parsed.theme;
      }
      if (typeof parsed.touchConfirm === 'boolean') {
        state.touchConfirm = parsed.touchConfirm;
      }
      if (parsed.currentLessonId && LESSONS.some((l) => l.id === parsed.currentLessonId)) {
        state.currentLessonId = parsed.currentLessonId;
      }
    } catch (_err) {
      // Ignore storage errors
    }
  }

  function savePrefs() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          solvedLessons: Array.from(state.solvedLessons),
          theme: state.theme,
          touchConfirm: state.touchConfirm,
          boardSkin: state.boardSkin,
          sfxEnabled: state.sfxEnabled,
          sfxVolume: state.sfxVolume,
          musicEnabled: state.musicEnabled,
          musicTrack: state.musicTrack,
          musicVolume: state.musicVolume,
          rainEnabled: state.rainEnabled,
          botRank: state.botRank,
          playerColor: state.playerColor,
          handicap: state.handicap,
          currentLessonId: state.currentLessonId
        })
      );
    } catch (_err) {
      // Ignore storage errors
    }
  }

  function applySkin(skinId, playPreview = false) {
    const skin = getSkinById(skinId);
    state.boardSkin = skin.id;
    audio.setAcousticProfile(skin.acousticProfile);
    if (trainerRenderer) trainerRenderer.setSkin(skin.id);
    if (sandboxRenderer) sandboxRenderer.setSkin(skin.id);

    document.querySelectorAll('#skinPickerGrid .skin-swatch-card').forEach((el) => {
      el.classList.toggle('active', el.dataset.skin === skin.id);
    });
    document.querySelectorAll('#sandboxSkinRow .skin-mini-dot').forEach((el) => {
      el.classList.toggle('active', el.dataset.skin === skin.id);
    });

    if (playPreview) {
      audio.playStone({ acousticProfile: skin.acousticProfile });
    }
  }

  function syncAudioControls() {
    audio.setSfxEnabled(state.sfxEnabled);
    audio.setSfxVolume(state.sfxVolume);
    audio.setMusicTrack(state.musicTrack);
    audio.setMusicVolume(state.musicVolume);

    document.getElementById('soundToggleBtn').innerHTML =
      state.sfxEnabled ? ICONS.soundOn : ICONS.soundOff;

    const musicBtn = document.getElementById('musicToggleBtn');
    musicBtn.innerHTML = state.musicEnabled ? ICONS.musicOn : ICONS.musicOff;
    musicBtn.classList.toggle('music-playing', state.musicEnabled);

    const sfxBtn = document.getElementById('sfxToggleBtn');
    sfxBtn.textContent = state.sfxEnabled ? 'Đang bật' : 'Đã tắt';
    sfxBtn.classList.toggle('active-toggle', state.sfxEnabled);

    const sfxSlider = document.getElementById('sfxVolumeSlider');
    sfxSlider.value = String(Math.round(state.sfxVolume * 100));
    document.getElementById('sfxVolumeValue').textContent = `${sfxSlider.value}%`;

    const stMusicBtn = document.getElementById('studioMusicToggleBtn');
    stMusicBtn.textContent = state.musicEnabled ? 'Đang phát' : 'Tắt nhạc';
    stMusicBtn.classList.toggle('active-toggle', state.musicEnabled);

    const mSlider = document.getElementById('musicVolumeSlider');
    mSlider.value = String(Math.round(state.musicVolume * 100));
    document.getElementById('musicVolumeValue').textContent = `${mSlider.value}%`;

    document.querySelectorAll('#musicTrackGroup .seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.track === state.musicTrack);
    });

    const rainBtn = document.getElementById('rainToggleBtn');
    rainBtn.textContent = state.rainEnabled ? 'Đang bật' : 'Tắt';
    rainBtn.classList.toggle('active-toggle', state.rainEnabled);
  }

  function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.getElementById('themeToggleBtn').innerHTML =
      state.theme === 'dark' ? ICONS.sun : ICONS.moon;
  }

  function renderSkinPickers() {
    const grid = document.getElementById('skinPickerGrid');
    const miniRow = document.getElementById('sandboxSkinRow');
    grid.innerHTML = '';
    miniRow.innerHTML = '';

    for (const skin of BOARD_SKINS) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `skin-swatch-card ${skin.id === state.boardSkin ? 'active' : ''}`;
      card.dataset.skin = skin.id;
      card.innerHTML = `
        <span class="skin-preview" style="background: linear-gradient(135deg, ${skin.bgStops[0]}, ${skin.bgStops[2]}); color: ${skin.gridColor};"></span>
        <span class="skin-meta">
          <strong>${skin.name}</strong>
          <span>${skin.subtitle}</span>
        </span>
      `;
      card.addEventListener('click', () => {
        applySkin(skin.id, true);
        savePrefs();
      });
      grid.appendChild(card);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = `skin-mini-dot ${skin.id === state.boardSkin ? 'active' : ''}`;
      dot.dataset.skin = skin.id;
      dot.title = skin.name;
      dot.setAttribute('aria-label', skin.name);
      dot.style.background = `linear-gradient(135deg, ${skin.bgStops[0]}, ${skin.bgStops[2]})`;
      dot.addEventListener('click', () => {
        applySkin(skin.id, true);
        savePrefs();
      });
      miniRow.appendChild(dot);
    }
  }

  function openStudio() {
    closeLessonDrawer();
    closeSandboxSettings();
    document.getElementById('studioBackdrop').hidden = false;
    const panel = document.getElementById('studioPanel');
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeStudio() {
    document.getElementById('studioBackdrop').hidden = true;
    const panel = document.getElementById('studioPanel');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    if (
      !document.getElementById('lessonDrawer').classList.contains('open') &&
      !document.getElementById('sandboxPanel').classList.contains('open')
    ) {
      document.body.classList.remove('modal-open');
    }
  }

  function openSandboxSettings() {
    closeLessonDrawer();
    closeStudio();
    document.getElementById('sandboxSettingsBackdrop').hidden = false;
    document.getElementById('sandboxPanel').classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeSandboxSettings() {
    document.getElementById('sandboxSettingsBackdrop').hidden = true;
    document.getElementById('sandboxPanel').classList.remove('open');
    if (
      !document.getElementById('lessonDrawer').classList.contains('open') &&
      !document.getElementById('studioPanel').classList.contains('open')
    ) {
      document.body.classList.remove('modal-open');
    }
  }

  function syncTouchConfirmButtons() {
    if (trainerRenderer) trainerRenderer.setTouchConfirm(state.touchConfirm);
    if (sandboxRenderer) sandboxRenderer.setTouchConfirm(state.touchConfirm);

    const tBtn = document.getElementById('trainerTouchModeBtn');
    tBtn.classList.toggle('active-toggle', state.touchConfirm);
    tBtn.textContent = state.touchConfirm ? 'Chạm 2 bước: Bật' : 'Chạm 2 bước';

    const sBtn = document.getElementById('sandboxTouchModeBtn');
    sBtn.classList.toggle('active-toggle', state.touchConfirm);
    sBtn.textContent = `Chạm 2 bước để đặt quân: ${state.touchConfirm ? 'Bật' : 'Tắt'}`;
  }

  function estimateRankLabel(doneCount) {
    const total = LESSONS.length || 1;
    const ratio = doneCount / total;
    if (ratio >= 1) return '1 Dan (Thành thạo)';
    if (ratio >= 0.88) return '2 Kyu (Cao cấp)';
    if (ratio >= 0.72) return '5 Kyu (Khá giỏi)';
    if (ratio >= 0.55) return '8 Kyu (Trung cấp)';
    if (ratio >= 0.35) return '15 Kyu (Sơ trung cấp)';
    if (ratio >= 0.15) return '20 Kyu (Cơ bản)';
    return '30 Kyu (Nhập môn)';
  }

  function updateGlobalProgress() {
    const total = LESSONS.length;
    const done = state.solvedLessons.size;
    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById('navLessonCount').textContent = String(total);
    document.getElementById('overallProgressText').textContent = `${done}/${total} thế cờ`;
    document.getElementById('sidebarProgressBadge').textContent = `${done}/${total}`;
    document.getElementById('roadmapRankBadge').textContent = estimateRankLabel(done);
    document.getElementById('roadmapProgressCaption').textContent = `${done}/${total} bài (${pct}%)`;
    document.getElementById('roadmapProgressBar').style.width = `${pct}%`;
  }

  function closeLessonDrawer() {
    document.getElementById('lessonDrawer').classList.remove('open');
    document.getElementById('lessonDrawerBackdrop').hidden = true;
    if (
      !document.getElementById('studioPanel').classList.contains('open') &&
      !document.getElementById('sandboxPanel').classList.contains('open')
    ) {
      document.body.classList.remove('modal-open');
    }
  }

  function openLessonDrawer() {
    closeStudio();
    closeSandboxSettings();
    document.getElementById('lessonDrawer').classList.add('open');
    document.getElementById('lessonDrawerBackdrop').hidden = false;
    document.body.classList.add('modal-open');
  }

  function switchTab(tabId) {
    stopDemoAutoplay();
    closeLessonDrawer();
    closeStudio();
    closeSandboxSettings();
    state.activeTab = tabId;

    document.querySelectorAll('.nav-tab, .bottom-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    const resizeTarget =
      tabId === 'trainer' ? trainerRenderer : tabId === 'sandbox' ? sandboxRenderer : null;
    if (resizeTarget) {
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(() => resizeTarget.resize());
      } else {
        resizeTarget.resize();
      }
    }
    window.scrollTo({
      top: 0,
      behavior: window.innerWidth <= 860 ? 'auto' : 'smooth'
    });
  }

  // ==================== TAB 1: ROADMAP ====================
  function renderRoadmap() {
    const grid = document.getElementById('roadmapStagesGrid');
    grid.innerHTML = '';

    for (const stage of ROADMAP_STAGES) {
      const stageLessons = LESSONS.filter((l) => l.stageId === stage.id);
      const doneCount = stageLessons.filter((l) => state.solvedLessons.has(l.id)).length;
      const pct = stageLessons.length ? Math.round((doneCount / stageLessons.length) * 100) : 0;

      const card = document.createElement('article');
      card.className = 'stage-card card';
      card.innerHTML = `
        <div class="stage-top">
          <div>
            <h4>${stage.title}</h4>
            <div class="stage-meta">
              <span class="badge badge-code">${stage.rankRange}</span>
              <span class="badge">Bàn ${stage.boardSize}</span>
              <span class="badge">${stage.duration}</span>
            </div>
          </div>
          <span class="badge ${doneCount === stageLessons.length ? 'badge-solved' : ''}">
            ${doneCount}/${stageLessons.length} bài
          </span>
        </div>
        <p class="stage-goal">${stage.goal}</p>
        <div class="stage-details">
          <div><strong>Lịch luyện tập:</strong> ${stage.weeklyPlan}</div>
          <div><strong>Mục tiêu đạt:</strong> ${stage.masteryCheck}</div>
        </div>
        <div class="stage-progress-bar">
          <div class="stage-progress-fill" style="width: ${pct}%"></div>
        </div>
        <div class="stage-lessons"></div>
      `;

      const pillsWrap = card.querySelector('.stage-lessons');
      for (const lesson of stageLessons) {
        const isSolved = state.solvedLessons.has(lesson.id);
        const pill = document.createElement('button');
        pill.className = `stage-lesson-pill ${isSolved ? 'solved' : ''}`;
        pill.textContent = `${isSolved ? '✓ ' : ''}${lesson.code} ${lesson.title}`;
        pill.addEventListener('click', () => {
          openLesson(lesson.id, 'demo');
          switchTab('trainer');
        });
        pillsWrap.appendChild(pill);
      }

      grid.appendChild(card);
    }

    const firstUnsolved = LESSONS.find((l) => !state.solvedLessons.has(l.id));
    const heroBtn = document.getElementById('heroStartBtn');
    if (firstUnsolved) {
      heroBtn.textContent =
        state.solvedLessons.size > 0
          ? `Tiếp tục Bài ${firstUnsolved.code}: ${firstUnsolved.title} →`
          : 'Bắt đầu Bài 1.1 ngay →';
    } else {
      heroBtn.textContent = `🎉 Đã xong ${LESSONS.length}/${LESSONS.length} bài — Ôn lại từ đầu →`;
    }
  }

  // ==================== TAB 2: TRAINER ====================
  function renderLessonSidebar() {
    const container = document.getElementById('lessonListContainer');
    container.innerHTML = '';

    for (const stage of ROADMAP_STAGES) {
      const stageLessons = LESSONS.filter((l) => {
        if (l.stageId !== stage.id) return false;
        if (state.lessonFilter === 'all') return true;
        if (state.lessonFilter === 'unsolved') return !state.solvedLessons.has(l.id);
        return l.difficulty === state.lessonFilter;
      });
      if (stageLessons.length === 0) continue;

      const label = document.createElement('div');
      label.className = 'stage-group-label';
      label.textContent = stage.title;
      container.appendChild(label);

      for (const lesson of stageLessons) {
        const btn = document.createElement('button');
        btn.className = `lesson-item ${lesson.id === state.currentLessonId ? 'active' : ''}`;
        const solved = state.solvedLessons.has(lesson.id);
        btn.innerHTML = `
          <span class="lesson-item-main">
            <span class="lesson-item-code">${lesson.code}</span>
            <span class="lesson-item-title">${lesson.title}</span>
          </span>
          <span class="lesson-check">${solved ? '✓' : ''}</span>
        `;
        btn.addEventListener('click', () => {
          openLesson(lesson.id, 'demo');
          closeLessonDrawer();
        });
        container.appendChild(btn);
      }
    }
  }

  function getCurrentLesson() {
    return LESSONS.find((l) => l.id === state.currentLessonId) || LESSONS[0];
  }

  function syncTheoryAccordion() {
    const toggle = document.getElementById('theoryAccordionToggle');
    const body = document.getElementById('theoryCollapseBody');
    const isMobile = window.innerWidth <= 1080;
    const expanded = isMobile ? state.theoryExpanded : true;
    toggle.setAttribute('aria-expanded', String(expanded));
    body.classList.toggle('collapsed', !expanded);
  }

  function getLessonVariations(lesson) {
    if (Array.isArray(lesson.variations) && lesson.variations.length > 0) {
      return lesson.variations;
    }
    return [
      {
        id: 'demo',
        kind: 'good',
        label: 'Minh họa từng bước',
        summary: lesson.summary,
        steps: lesson.demoSteps || []
      }
    ];
  }

  function getActiveVariation(lesson) {
    const vars = getLessonVariations(lesson);
    const idx = Math.max(0, Math.min(state.demoVariationIndex, vars.length - 1));
    state.demoVariationIndex = idx;
    return vars[idx];
  }

  function renderVariationTabs(lesson) {
    const wrap = document.getElementById('demoVariationTabs');
    const variations = getLessonVariations(lesson);
    wrap.innerHTML = '';

    variations.forEach((v, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const kindClass = v.kind === 'bad' ? 'bad' : v.kind === 'ok' ? 'ok' : 'good';
      btn.className = `variation-pill ${kindClass} ${idx === state.demoVariationIndex ? 'active' : ''}`;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(idx === state.demoVariationIndex));
      const badgeLetter = String.fromCharCode(65 + idx);
      const icon = v.kind === 'bad' ? '✕' : v.kind === 'ok' ? '△' : '✓';
      btn.innerHTML = `<span class="variation-badge">${badgeLetter}</span><span>${icon} ${v.label}</span>`;
      btn.addEventListener('click', () => {
        stopDemoAutoplay();
        state.demoVariationIndex = idx;
        renderVariationTabs(lesson);
        applyDemoStep(0, false);
      });
      wrap.appendChild(btn);
    });
  }

  function renderDetailCompareList(lesson) {
    const wrap = document.getElementById('detailCompareList');
    const variations = getLessonVariations(lesson);
    wrap.innerHTML = '';

    variations.forEach((v, idx) => {
      const card = document.createElement('button');
      card.type = 'button';
      const kindClass = v.kind === 'bad' ? 'bad' : v.kind === 'ok' ? 'ok' : 'good';
      const tagText = v.kind === 'bad' ? 'Chưa tốt' : v.kind === 'ok' ? 'Chấp nhận được' : 'Nước tốt';
      const badgeLetter = String.fromCharCode(65 + idx);
      card.className = `compare-card ${kindClass}`;
      card.innerHTML = `
        <div class="compare-card-top">
          <span class="compare-card-title"><strong>${badgeLetter}.</strong> ${v.label}</span>
          <span class="quality-tag ${kindClass}">${tagText}</span>
        </div>
        <p class="compare-card-summary">${v.summary || ''}</p>
      `;
      card.addEventListener('click', () => {
        stopDemoAutoplay();
        state.demoVariationIndex = idx;
        if (state.trainerMode !== 'demo') {
          setTrainerMode('demo');
        } else {
          renderVariationTabs(lesson);
        }
        const steps = v.steps || [];
        applyDemoStep(steps.length > 1 ? 1 : 0, true);
      });
      wrap.appendChild(card);
    });
  }

  function openLesson(lessonId, preferredMode = 'demo') {
    stopDemoAutoplay();
    state.currentLessonId = lessonId;
    state.trainerMode = preferredMode;
    state.demoVariationIndex = 0;
    state.demoStepIndex = 0;
    state.lastWrongCoord = null;
    state.trainerZoomed = true;
    savePrefs();

    const lesson = getCurrentLesson();
    renderLessonSidebar();
    renderVariationTabs(lesson);
    renderDetailCompareList(lesson);

    document.getElementById('mobileLessonLabel').textContent = `${lesson.code} · ${lesson.title}`;
    document.getElementById('detailCode').textContent = `Bài ${lesson.code}`;
    document.getElementById('detailDifficulty').textContent = lesson.difficulty;
    document.getElementById('detailBoardSize').textContent = `${lesson.boardSize}×${lesson.boardSize}`;
    document.getElementById('detailSolvedBadge').hidden = !state.solvedLessons.has(lesson.id);
    document.getElementById('detailTitle').textContent = lesson.title;
    document.getElementById('detailJpTerm').textContent = lesson.jpTerm;
    document.getElementById('detailSummary').textContent = lesson.summary;
    document.getElementById('detailTheoryHtml').innerHTML = lesson.theoryHtml;
    document.getElementById('puzzlePromptText').textContent = lesson.puzzle.prompt;

    const zoomBtn = document.getElementById('trainerZoomBtn');
    zoomBtn.hidden = !lesson.cropRect;
    updateZoomButton();

    const idx = LESSONS.findIndex((l) => l.id === lesson.id);
    const hasPrev = idx > 0;
    const hasNext = idx < LESSONS.length - 1;
    document.getElementById('prevLessonBtn').disabled = !hasPrev;
    document.getElementById('nextLessonBtn').disabled = !hasNext;
    document.getElementById('mobilePrevLessonBtn').disabled = !hasPrev;
    document.getElementById('mobileNextLessonBtn').disabled = !hasNext;

    syncTheoryAccordion();
    setTrainerMode(preferredMode);
  }

  function updateZoomButton() {
    const lesson = getCurrentLesson();
    const zoomBtn = document.getElementById('trainerZoomBtn');
    if (!lesson.cropRect) {
      trainerRenderer.setCropRect(null);
      return;
    }
    trainerRenderer.setCropRect(state.trainerZoomed ? lesson.cropRect : null);
    zoomBtn.textContent = state.trainerZoomed ? 'Toàn bàn 19×19' : 'Phóng to góc';
  }

  function setTrainerMode(mode) {
    stopDemoAutoplay();
    state.trainerMode = mode;

    document.getElementById('modeDemoBtn').classList.toggle('active', mode === 'demo');
    document.getElementById('modePuzzleBtn').classList.toggle('active', mode === 'puzzle');
    document.getElementById('demoControlsBar').hidden = mode !== 'demo';
    document.getElementById('puzzleControlsBar').hidden = mode !== 'puzzle';
    document.getElementById('puzzlePromptBox').hidden = mode !== 'puzzle';

    if (mode === 'demo') {
      setFeedback(null);
      renderVariationTabs(getCurrentLesson());
      applyDemoStep(0, false);
    } else {
      initPuzzle();
    }
  }

  function getFirstMoveOfVariation(variation) {
    for (const step of variation.steps || []) {
      if (Array.isArray(step.moves) && step.moves.length > 0) {
        return step.moves[0];
      }
    }
    return null;
  }

  function applyDemoStep(stepIndex, withAudio = true) {
    const lesson = getCurrentLesson();
    const variations = getLessonVariations(lesson);
    const activeVar = getActiveVariation(lesson);
    const steps = activeVar.steps || [];
    const clamped = Math.max(0, Math.min(stepIndex, Math.max(0, steps.length - 1)));
    state.demoStepIndex = clamped;

    const basePos = activeVar.initialPosition || lesson.demoInitialPosition || lesson.puzzle.initialPosition;
    trainerEngine = new GoEngine(lesson.boardSize);
    trainerEngine.setPosition(basePos, BLACK);

    let lastCapCount = 0;
    let movedOnLast = false;
    for (let i = 0; i <= clamped; i++) {
      const step = steps[i];
      if (step && Array.isArray(step.moves)) {
        for (const mv of step.moves) {
          const r = trainerEngine.playMove(mv.x, mv.y, mv.color);
          if (i === clamped && r.ok) {
            movedOnLast = true;
            lastCapCount += r.captured.length;
          }
        }
      }
    }

    if (withAudio && movedOnLast) {
      audio.playStone({ isCapture: lastCapCount > 0, captureCount: lastCapCount });
    }

    const currentStep = steps[clamped] || { caption: '' };
    let annotations = Array.isArray(currentStep.markers) ? [...currentStep.markers] : [];

    // On initial step 0, overlay A/B/C comparison badges for variations sharing this starting position
    if (clamped === 0 && variations.length > 1) {
      const baseKey = JSON.stringify(basePos);
      const seenCoords = new Set();
      variations.forEach((v, idx) => {
        const vPos = v.initialPosition || lesson.demoInitialPosition || lesson.puzzle.initialPosition;
        if (JSON.stringify(vPos) !== baseKey) return;
        const firstMv = getFirstMoveOfVariation(v);
        if (!firstMv) return;
        const ck = `${firstMv.x},${firstMv.y}`;
        if (seenCoords.has(ck) || trainerEngine.get(firstMv.x, firstMv.y) !== 0) return;
        seenCoords.add(ck);
        annotations.push({
          x: firstMv.x,
          y: firstMv.y,
          type: 'label',
          badge: true,
          text: String.fromCharCode(65 + idx),
          color: v.kind === 'bad' ? '#dc2626' : v.kind === 'ok' ? '#d97706' : '#16a34a'
        });
      });
    }

    trainerRenderer.setEngine(trainerEngine);
    trainerRenderer.setInteractive(false);
    trainerRenderer.setTerritoryMap(null);
    trainerRenderer.setDeadMap(null);
    trainerRenderer.setScoringMode(false);
    trainerRenderer.setAnnotations(annotations);
    updateZoomButton();

    document.getElementById('demoStepCounter').textContent = `${clamped + 1}/${Math.max(1, steps.length)}`;
    document.getElementById('demoCaptionText').textContent = currentStep.caption || '';

    const reasonBox = document.getElementById('demoReasonBox');
    if (currentStep.why) {
      reasonBox.hidden = false;
      const reasonKind = clamped === 0 ? 'info' : activeVar.kind === 'bad' ? 'bad' : activeVar.kind === 'ok' ? 'ok' : 'good';
      reasonBox.className = `demo-reason-box ${reasonKind}`;
      const prefix =
        clamped === 0
          ? 'Quan sát & So sánh'
          : activeVar.kind === 'bad'
            ? 'Tại sao nước này chưa tốt'
            : activeVar.kind === 'ok'
              ? 'Phân tích nước đi'
              : 'Tại sao nước này tốt';
      reasonBox.innerHTML = `<strong>${prefix}:</strong> ${currentStep.why}`;
    } else {
      reasonBox.hidden = true;
      reasonBox.textContent = '';
    }

    document.getElementById('demoFirstBtn').disabled = clamped === 0;
    document.getElementById('demoPrevBtn').disabled = clamped === 0;
    document.getElementById('demoNextBtn').disabled = clamped >= steps.length - 1;
    document.getElementById('demoLastBtn').disabled = clamped >= steps.length - 1;
    document.getElementById('demoStartPuzzleBtn').hidden = clamped < steps.length - 1;

    const dotsWrap = document.getElementById('demoStepDots');
    dotsWrap.innerHTML = '';
    for (let i = 0; i < steps.length; i++) {
      const dot = document.createElement('span');
      dot.className = `demo-dot ${i < clamped ? 'done' : i === clamped ? 'current' : ''}`;
      dotsWrap.appendChild(dot);
    }
  }

  function stopDemoAutoplay() {
    if (state.demoTimer) {
      clearInterval(state.demoTimer);
      state.demoTimer = null;
    }
    const playBtn = document.getElementById('demoPlayBtn');
    if (playBtn) playBtn.textContent = '▶ Tự chạy';
  }

  function toggleDemoAutoplay() {
    if (state.demoTimer) {
      stopDemoAutoplay();
      return;
    }
    const lesson = getCurrentLesson();
    const steps = getActiveVariation(lesson).steps || [];
    if (steps.length <= 1) return;
    if (state.demoStepIndex >= steps.length - 1) {
      applyDemoStep(0, false);
    }
    document.getElementById('demoPlayBtn').textContent = '⏸ Tạm dừng';
    state.demoTimer = setInterval(() => {
      const curSteps = getActiveVariation(getCurrentLesson()).steps || [];
      if (state.demoStepIndex >= curSteps.length - 1) {
        stopDemoAutoplay();
        return;
      }
      applyDemoStep(state.demoStepIndex + 1, true);
    }, 1850);
  }

  function initPuzzle() {
    const lesson = getCurrentLesson();
    trainerEngine = new GoEngine(lesson.boardSize);
    trainerEngine.setPosition(lesson.puzzle.initialPosition, lesson.puzzle.playerColor || BLACK);
    state.puzzleNode = lesson.puzzle.tree;
    state.puzzleLocked = false;

    trainerRenderer.setEngine(trainerEngine);
    trainerRenderer.setInteractive(true);
    trainerRenderer.setHoverColor(lesson.puzzle.playerColor || BLACK);
    trainerRenderer.setTerritoryMap(null);
    trainerRenderer.setAnnotations([]);
    updateZoomButton();

    const hintInstruction = state.touchConfirm
      ? 'Chạm vào giao điểm để xem trước (hoặc kéo ngón tay), rồi nhấn "Đặt quân".'
      : 'Nhấn vào giao điểm trên bàn cờ để thực hiện nước đi của bạn.';
    setFeedback('info', hintInstruction, false);
  }

  function setFeedback(kind, text, showNextCta = false, showCompareCta = false) {
    const box = document.getElementById('puzzleFeedbackBox');
    const txt = document.getElementById('puzzleFeedbackText');
    const nextBtn = document.getElementById('feedbackNextLessonBtn');
    const cmpBtn = document.getElementById('feedbackCompareBtn');
    if (!kind || !text) {
      box.hidden = true;
      txt.textContent = '';
      nextBtn.hidden = true;
      cmpBtn.hidden = true;
      return;
    }
    box.hidden = false;
    box.className = `feedback-box ${kind}`;
    txt.textContent = text;
    const idx = LESSONS.findIndex((l) => l.id === state.currentLessonId);
    nextBtn.hidden = !showNextCta || idx >= LESSONS.length - 1;
    cmpBtn.hidden = !showCompareCta;
  }

  function handleTrainerBoardClick(x, y) {
    if (state.trainerMode !== 'puzzle' || state.puzzleLocked) return;
    const lesson = getCurrentLesson();
    const playerColor = lesson.puzzle.playerColor || BLACK;
    const legal = trainerEngine.isLegalMove(x, y, playerColor);
    if (!legal.legal) {
      audio.playSoftError();
      const msg =
        legal.reason === 'ko'
          ? 'Vi phạm Luật Cướp (Ko): không thể ăn trả ngay lập tức!'
          : legal.reason === 'suicide'
            ? 'Vi phạm Luật Tự Sát (0 khí và không ăn được quân địch)!'
            : 'Vị trí này đã có quân hoặc không hợp lệ.';
      setFeedback('error', msg);
      return;
    }

    const res = trainerEngine.playMove(x, y, playerColor);
    audio.playStone({ isCapture: res.captured.length > 0, captureCount: res.captured.length });
    trainerRenderer.setAnnotations([]);
    trainerRenderer.render();

    const key = `${x},${y}`;
    const branch = state.puzzleNode ? state.puzzleNode[key] : null;

    if (!branch) {
      state.puzzleLocked = true;
      state.lastWrongCoord = key;
      audio.playSoftError();
      setFeedback('error', `${lesson.puzzle.defaultWrongFeedback} Nhấn "Thử lại" để đánh lại.`, false, true);
      return;
    }

    if (branch.status === 'solved') {
      state.puzzleLocked = true;
      state.lastWrongCoord = null;
      state.solvedLessons.add(lesson.id);
      savePrefs();
      updateGlobalProgress();
      renderRoadmap();
      renderLessonSidebar();
      document.getElementById('detailSolvedBadge').hidden = false;
      setFeedback('success', `🎉 ${branch.feedback}`, true, true);
      setTimeout(() => audio.playSolved(), 140);
      return;
    }

    if (branch.status === 'wrong') {
      state.puzzleLocked = true;
      state.lastWrongCoord = key;
      if (Array.isArray(branch.reply)) {
        const [rx, ry] = branch.reply;
        setTimeout(() => {
          const oppRes = trainerEngine.playMove(rx, ry, playerColor === BLACK ? WHITE : BLACK);
          if (oppRes.ok) {
            audio.playStone({
              isCapture: oppRes.captured.length > 0,
              captureCount: oppRes.captured.length
            });
          }
          trainerRenderer.render();
        }, 300);
      }
      setFeedback('error', `❌ ${branch.feedback} Nhấn "Thử lại" để thử hướng khác.`, false, true);
      return;
    }

    if (branch.status === 'continue') {
      state.puzzleLocked = true;
      setFeedback('info', branch.feedback);
      const [rx, ry] = branch.reply;
      setTimeout(() => {
        const oppColor = playerColor === BLACK ? WHITE : BLACK;
        const oppRes = trainerEngine.playMove(rx, ry, oppColor);
        if (oppRes.ok) {
          audio.playStone({
            isCapture: oppRes.captured.length > 0,
            captureCount: oppRes.captured.length
          });
        }
        trainerRenderer.render();
        state.puzzleNode = branch.next || {};
        state.puzzleLocked = false;
      }, 380);
    }
  }

  function showPuzzleHint() {
    if (state.trainerMode !== 'puzzle') return;
    const lesson = getCurrentLesson();
    const hint = lesson.puzzle.hint;
    if (!hint) return;
    setFeedback('hint', `💡 Gợi ý: ${hint.text}`);
    if (hint.marker && state.puzzleNode === lesson.puzzle.tree) {
      trainerRenderer.setAnnotations([{ ...hint.marker, color: '#d97706' }]);
    }
  }

  function goToAdjacentLesson(delta) {
    const idx = LESSONS.findIndex((l) => l.id === state.currentLessonId);
    const target = idx + delta;
    if (target >= 0 && target < LESSONS.length) {
      openLesson(LESSONS[target].id, 'demo');
    }
  }

  // ==================== TAB 3: SANDBOX ====================
  function getActiveKomi() {
    return state.sandboxMode === 'bot' && state.handicap >= 2 ? 0.5 : 6.5;
  }

  function getBotColor() {
    return state.playerColor === BLACK ? WHITE : BLACK;
  }

  function renderBotRanks() {
    const group = document.getElementById('botRankGroup');
    group.innerHTML = '';
    const shortLabels = {
      '20k': 'Nhập môn',
      '10k': 'Cơ bản',
      '1d': 'Nhất đẳng',
      '3d': 'Tam đẳng',
      '4d': 'Tứ đẳng',
      '6d': 'Lục đẳng',
      '9d': 'Cửu đẳng'
    };

    for (const r of BOT_RANKS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `rank-pill ${r.id === state.botRank ? 'active' : ''}`;
      btn.dataset.rank = r.id;
      btn.innerHTML = `
        <span class="rank-pill-code">${r.short}</span>
        <span class="rank-pill-label">${shortLabels[r.id] || r.short}</span>
      `;
      group.appendChild(btn);
    }

    const active = getRankConfig(state.botRank);
    document.getElementById('botRankDesc').textContent =
      `${active.name}: ${active.desc} (AI chạy trực tiếp trên trình duyệt, không cần mạng.)`;
  }

  function syncSandboxSettingsUI() {
    const isBot = state.sandboxMode === 'bot';
    document.getElementById('botSettingsWrap').hidden = !isBot;

    document.querySelectorAll('#sandboxSizeGroup .seg-btn').forEach((b) => {
      b.classList.toggle('active', parseInt(b.dataset.size, 10) === state.sandboxSize);
    });
    document.querySelectorAll('#sandboxModeGroup .seg-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.mode === state.sandboxMode);
    });
    document.querySelectorAll('#sandboxPlayerColorGroup .seg-btn').forEach((b) => {
      b.classList.toggle('active', parseInt(b.dataset.color, 10) === state.playerColor);
    });
    document.querySelectorAll('#sandboxHandicapGroup .seg-btn').forEach((b) => {
      b.classList.toggle('active', parseInt(b.dataset.handicap, 10) === state.handicap);
    });

    renderBotRanks();
    document.getElementById('sandboxScoreTitle').textContent =
      `Ước lượng điểm số (Komi ${getActiveKomi()})`;

    const summaryEl = document.getElementById('mobileSandboxSummary');
    const sizeLabel = `${state.sandboxSize}×${state.sandboxSize}`;
    if (isBot) {
      const rankShort = getRankConfig(state.botRank).short;
      const colorLabel = state.playerColor === BLACK ? 'Cầm Đen' : 'Cầm Trắng';
      const hcapLabel = state.handicap >= 2 ? ` · Chấp ${state.handicap}` : '';
      summaryEl.textContent = `${sizeLabel} · Máy ${rankShort} · ${colorLabel}${hcapLabel}`;
    } else {
      summaryEl.textContent = `${sizeLabel} · Tự bày cờ 2 bên`;
    }
  }

  function syncCoachButtons() {
    const reviewBtn = document.getElementById('sandboxCoachReviewBtn');
    const hintBtn = document.getElementById('sandboxCoachHintBtn');
    const clearBtn = document.getElementById('sandboxCoachClearBtn');
    if (reviewBtn) {
      reviewBtn.disabled = !state.lastPlayerBeforeEngine || !state.lastPlayerMove || state.botThinking;
    }
    if (hintBtn) {
      hintBtn.disabled = state.botThinking || state.sandboxPhase !== 'playing';
    }
    if (clearBtn) {
      clearBtn.hidden = !state.coachActive;
    }
  }

  function clearSandboxCoach() {
    state.coachActive = false;
    const card = document.getElementById('sandboxCoachCard');
    if (card) card.hidden = true;
    if (sandboxRenderer) sandboxRenderer.setAnnotations([]);
    syncCoachButtons();
  }

  function initSandbox() {
    sandboxEngine = new GoEngine(state.sandboxSize);
    if (state.sandboxMode === 'bot' && state.handicap >= 2) {
      sandboxEngine.setupHandicap(state.handicap);
    }
    state.sandboxShowScore = false;
    state.sandboxPhase = 'playing';
    state.sandboxDeadMap = null;
    state.lastPlayerBeforeEngine = null;
    state.lastPlayerMove = null;
    state.botThinking = false;
    sandboxRenderer.setEngine(sandboxEngine);
    sandboxRenderer.setDeadMap(null);
    sandboxRenderer.setScoringMode(false);
    sandboxRenderer.setTerritoryMap(null);
    sandboxRenderer.setAnnotations([]);
    sandboxRenderer.setInteractive(true);
    sandboxRenderer.setHoverColor(sandboxEngine.turn);
    document.getElementById('sandboxScoreCard').hidden = true;
    document.getElementById('sandboxScoreBanner').hidden = true;
    document.getElementById('sandboxScoreHint').hidden = true;
    document.getElementById('sandboxScoreActions').hidden = true;
    document.getElementById('sandboxScoreBtn').classList.remove('active-toggle');
    clearSandboxCoach();
    setSandboxNotice(null);
    syncSandboxSettingsUI();
    updateSandboxStats();

    if (state.sandboxMode === 'bot' && sandboxEngine.turn !== state.playerColor) {
      triggerBotTurn();
    }
  }

  function setSandboxNotice(kind, text) {
    const box = document.getElementById('sandboxNotice');
    if (!kind || !text) {
      box.hidden = true;
      box.textContent = '';
      return;
    }
    box.hidden = false;
    box.className = `feedback-box ${kind}`;
    box.textContent = text;
  }

  function updateSandboxStats() {
    const isBlackTurn = sandboxEngine.turn === BLACK;
    const rankShort = getRankConfig(state.botRank).short;
    const blackNameEl = document.getElementById('sandboxBlackName');
    const whiteNameEl = document.getElementById('sandboxWhiteName');

    if (state.sandboxMode === 'bot') {
      blackNameEl.textContent = state.playerColor === BLACK ? 'Đen (Bạn)' : `Đen (Máy ${rankShort})`;
      whiteNameEl.textContent = state.playerColor === WHITE ? 'Trắng (Bạn)' : `Trắng (Máy ${rankShort})`;
    } else {
      blackNameEl.textContent = 'Đen';
      whiteNameEl.textContent = 'Trắng';
    }

    const blackTag = document.getElementById('sandboxBlackTurnDot');
    const whiteTag = document.getElementById('sandboxWhiteTurnDot');
    const isBotThinkingBlack = state.botThinking && getBotColor() === BLACK;
    const isBotThinkingWhite = state.botThinking && getBotColor() === WHITE;

    blackTag.textContent = isBotThinkingBlack ? 'Đang tính...' : 'Đến lượt';
    whiteTag.textContent = isBotThinkingWhite ? 'Đang tính...' : 'Đến lượt';
    blackTag.classList.toggle('thinking', isBotThinkingBlack);
    whiteTag.classList.toggle('thinking', isBotThinkingWhite);

    document.getElementById('sandboxBlackHud').classList.toggle('active-turn', isBlackTurn);
    document.getElementById('sandboxWhiteHud').classList.toggle('active-turn', !isBlackTurn);
    blackTag.hidden = !isBlackTurn;
    whiteTag.hidden = isBlackTurn;
    document.getElementById('sandboxThinkingBadge').hidden = !state.botThinking;

    document.getElementById('sandboxMoveCount').textContent = String(sandboxEngine.moveCount);
    document.getElementById('sandboxBlackCaps').textContent = `${sandboxEngine.captures[BLACK]} tù binh`;
    document.getElementById('sandboxWhiteCaps').textContent = `${sandboxEngine.captures[WHITE]} tù binh`;
    sandboxRenderer.setHoverColor(sandboxEngine.turn);
    syncCoachButtons();
  }

  function getWinnerLabelForRule(sc, rule) {
    const winner = rule === 'chinese' ? sc.areaWinner : sc.winner;
    const margin = rule === 'chinese' ? sc.areaMargin : sc.margin;
    const isBlack = winner === BLACK;
    let playerTag = isBlack ? '⚫ Đen thắng' : '⚪ Trắng thắng';
    if (state.sandboxMode === 'bot') {
      playerTag += winner === state.playerColor ? ' (Bạn thắng!)' : ' (Máy thắng)';
    }
    return { winner, margin, playerTag };
  }

  function renderSandboxScore() {
    const komi = getActiveKomi();
    const deadMap = state.sandboxPhase === 'playing' ? null : state.sandboxDeadMap;
    const sc = sandboxEngine.scorePosition(komi, deadMap);
    sandboxRenderer.setDeadMap(deadMap);
    sandboxRenderer.setTerritoryMap(state.sandboxShowScore ? sc.territoryMap : null);

    const card = document.getElementById('sandboxScoreCard');
    card.hidden = !state.sandboxShowScore;
    if (!state.sandboxShowScore) return;

    const isScoring = state.sandboxPhase === 'scoring';
    const isFinished = state.sandboxPhase === 'finished';
    const rule = state.sandboxScoreRule;

    document.querySelectorAll('#sandboxScoreRuleSwitch .seg-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.rule === rule);
    });

    const titleEl = document.getElementById('sandboxScoreTitle');
    if (isFinished) {
      titleEl.textContent = `Kết quả chính thức (Komi ${komi})`;
    } else if (isScoring) {
      titleEl.textContent = `Kiểm tra quân chết & Đếm điểm (Komi ${komi})`;
    } else {
      titleEl.textContent = `Ước lượng điểm số tạm thời (Komi ${komi})`;
    }

    const banner = document.getElementById('sandboxScoreBanner');
    const hintEl = document.getElementById('sandboxScoreHint');
    const actionsEl = document.getElementById('sandboxScoreActions');
    const confirmBtn = document.getElementById('sandboxConfirmScoreBtn');
    const autoBtn = document.getElementById('sandboxAutoDeadBtn');
    const editBtn = document.getElementById('sandboxEditDeadBtn');

    const { winner, margin, playerTag } = getWinnerLabelForRule(sc, rule);
    const blackVal = rule === 'chinese' ? sc.blackArea : sc.blackTotal;
    const whiteVal = rule === 'chinese' ? sc.whiteArea : sc.whiteTotal;
    const sumVal = Math.max(1, blackVal + whiteVal);
    const blackPct = Math.round((blackVal / sumVal) * 100);

    banner.hidden = false;
    banner.className = `score-banner ${winner === BLACK ? 'black-wins' : 'white-wins'}`;
    banner.innerHTML = `
      <div class="score-banner-top">
        <strong>${isFinished ? '🏆 ' : ''}${playerTag}</strong>
        <span class="score-margin-pill">+${margin.toFixed(1)} điểm</span>
      </div>
      <div class="score-bar-track" aria-hidden="true">
        <div class="score-bar-black" style="width: ${blackPct}%"></div>
        <div class="score-bar-white" style="width: ${100 - blackPct}%"></div>
      </div>
    `;

    if (isScoring) {
      hintEl.hidden = false;
      hintEl.textContent =
        'Chạm vào bất kỳ quân cờ nào trên bàn để đánh dấu / bỏ đánh dấu quân chết (dấu × đỏ). Quân chết sẽ biến thành điểm đất và tù binh cho đối phương, sau đó nhấn "Chốt kết quả".';
    } else {
      hintEl.hidden = true;
    }

    const deadInfoBlack = sc.deadWhiteStones > 0 ? ` + ${sc.deadWhiteStones} quân chết` : '';
    const deadInfoWhite = sc.deadBlackStones > 0 ? ` + ${sc.deadBlackStones} quân chết` : '';

    const rowsHtml =
      rule === 'chinese'
        ? `
          <div class="score-row"><span>Đất Đen + Quân sống trên bàn</span><strong>${sc.blackTerritory} + ${sc.blackAliveStones} = ${sc.blackArea}</strong></div>
          <div class="score-row"><span>Đất Trắng + Quân sống + Komi</span><strong>${sc.whiteTerritory} + ${sc.whiteAliveStones} + ${sc.komi} = ${sc.whiteArea}</strong></div>
        `
        : `
          <div class="score-row"><span>Đất Đen + Tù binh${deadInfoBlack}</span><strong>${sc.blackTerritory} + ${sc.blackCaptures}${deadInfoBlack} = ${sc.blackTotal}</strong></div>
          <div class="score-row"><span>Đất Trắng + Tù binh${deadInfoWhite} + Komi</span><strong>${sc.whiteTerritory} + ${sc.whiteCaptures}${deadInfoWhite} + ${sc.komi} = ${sc.whiteTotal}</strong></div>
        `;

    const libertiesHtml = `
      <div class="score-liberties-box">
        <div class="score-liberties-head">
          <strong>Thống kê Khí (Liberties) &amp; Quân sống</strong>
          <span class="muted">Dame: ${sc.dameCount} ô</span>
        </div>
        <div class="score-liberties-grid">
          <div class="lib-stat">
            <span class="stone-dot black"></span>
            <div>
              <strong>${sc.blackLiberties} khí</strong>
              <span>${sc.blackGroups} đám · ${sc.blackAliveStones} quân sống</span>
            </div>
          </div>
          <div class="lib-stat">
            <span class="stone-dot white"></span>
            <div>
              <strong>${sc.whiteLiberties} khí</strong>
              <span>${sc.whiteGroups} đám · ${sc.whiteAliveStones} quân sống</span>
            </div>
          </div>
        </div>
        <p class="score-note">
          Đếm khí khi kết thúc giúp kiểm tra nhóm nào còn an toàn (≥ 2 khí / 2 mắt); thắng thua cuối ván tính theo Đất kín + Tù binh (+ Quân chết) + Komi.
        </p>
      </div>
    `;

    document.getElementById('sandboxScoreBody').innerHTML = rowsHtml + libertiesHtml;

    if (state.sandboxPhase === 'playing') {
      actionsEl.hidden = true;
    } else {
      actionsEl.hidden = false;
      confirmBtn.hidden = !isScoring;
      autoBtn.hidden = !isScoring;
      editBtn.hidden = !isFinished;
    }
  }

  function enterSandboxScoringPhase(noticeText) {
    if (state.botThinking) return;
    clearSandboxCoach();
    state.sandboxPhase = 'scoring';
    state.sandboxShowScore = true;
    state.sandboxDeadMap = sandboxEngine.detectDeadStones(getActiveKomi());
    sandboxRenderer.setScoringMode(true);
    sandboxRenderer.setInteractive(true);
    sandboxRenderer.setDeadMap(state.sandboxDeadMap);
    document.getElementById('sandboxScoreBtn').classList.add('active-toggle');
    renderSandboxScore();
    updateSandboxStats();
    setSandboxNotice(
      'info',
      noticeText ||
        'Đã vào chế độ Kết thúc ván & Đếm điểm: chạm vào quân chết trên bàn để điều chỉnh nếu cần, rồi nhấn "Chốt kết quả".'
    );
  }

  function finalizeSandboxScore() {
    state.sandboxPhase = 'finished';
    sandboxRenderer.setScoringMode(false);
    renderSandboxScore();
    const sc = sandboxEngine.scorePosition(getActiveKomi(), state.sandboxDeadMap);
    const { winner, playerTag, margin } = getWinnerLabelForRule(sc, state.sandboxScoreRule);
    setSandboxNotice('success', `🏆 Kết thúc ván đấu: ${playerTag} với cách biệt ${margin.toFixed(1)} điểm!`);
    if (state.sandboxMode === 'two' || winner === state.playerColor) {
      audio.playSolved();
    }
  }

  function resumeSandboxPlay() {
    state.sandboxPhase = 'playing';
    state.sandboxDeadMap = null;
    state.sandboxShowScore = false;
    sandboxEngine.consecutivePasses = 0;
    sandboxRenderer.setScoringMode(false);
    sandboxRenderer.setDeadMap(null);
    sandboxRenderer.setTerritoryMap(null);
    sandboxRenderer.setInteractive(true);
    document.getElementById('sandboxScoreCard').hidden = true;
    document.getElementById('sandboxScoreBtn').classList.remove('active-toggle');
    clearSandboxCoach();
    setSandboxNotice('info', 'Đã quay lại đánh tiếp ván cờ!');
    updateSandboxStats();
  }

  function showSandboxCoachHint() {
    if (state.botThinking || state.sandboxPhase !== 'playing') return;
    const turnColor = sandboxEngine.turn;
    const coach = sandboxEngine.getCoachSuggestions(turnColor, getActiveKomi());
    const turnLabel = turnColor === BLACK ? '⚫ Đen' : '⚪ Trắng';
    const canPlayDirectly =
      state.sandboxMode === 'two' || turnColor === state.playerColor;

    const badgeColors = { best: '#16a34a', good: '#0284c7', ok: '#d97706' };
    const annotations = [];
    for (const rec of coach.recommendations) {
      annotations.push({
        x: rec.x,
        y: rec.y,
        type: 'label',
        badge: true,
        text: rec.letter,
        color: badgeColors[rec.quality] || '#16a34a'
      });
    }
    for (const warn of coach.warnings) {
      annotations.push({
        x: warn.x,
        y: warn.y,
        type: 'label',
        badge: true,
        text: '✕',
        color: '#dc2626'
      });
    }
    sandboxRenderer.setAnnotations(annotations);

    const card = document.getElementById('sandboxCoachCard');
    const titleEl = document.getElementById('sandboxCoachTitle');
    const bodyEl = document.getElementById('sandboxCoachBody');
    titleEl.textContent = `💡 Gợi ý nước đi cho ${turnLabel}`;

    let html = '';
    for (const al of coach.alerts) {
      html += `<div class="coach-alert">${al}</div>`;
    }
    if (coach.suggestPass) {
      html += `<div class="coach-alert info">Thế trận gần như đã định hình xong — bạn có thể nhấn <strong>Bỏ lượt</strong> hoặc <strong>Kết thúc</strong> để đếm điểm!</div>`;
    }

    if (coach.recommendations.length > 0) {
      html += '<div class="coach-move-list">';
      for (const rec of coach.recommendations) {
        const qualityText =
          rec.quality === 'best' ? 'Tốt nhất' : rec.quality === 'good' ? 'Rất tốt' : 'Khả thi';
        const tagsHtml = rec.tags.map((t) => `<span class="coach-tag">${t}</span>`).join('');
        const playBtnHtml = canPlayDirectly
          ? `<button type="button" class="btn btn-sm btn-primary coach-play-btn" data-x="${rec.x}" data-y="${rec.y}">Đánh ${rec.coord}</button>`
          : '';
        html += `
          <div class="coach-move-item ${rec.quality}">
            <div class="coach-move-top">
              <div class="coach-move-id">
                <span class="coach-letter ${rec.quality}">${rec.letter}</span>
                <strong>${rec.coord}</strong>
                <span class="quality-tag ${rec.quality === 'ok' ? 'ok' : 'good'}">${qualityText}</span>
              </div>
              ${playBtnHtml}
            </div>
            <div class="coach-tags">${tagsHtml}</div>
            <p class="coach-reason">${rec.reason}</p>
          </div>
        `;
      }
      html += '</div>';
    }

    if (coach.warnings.length > 0) {
      html += '<div class="coach-warnings-title">Nước nên tránh lúc này:</div><div class="coach-move-list">';
      for (const warn of coach.warnings) {
        const tagsHtml = warn.tags.map((t) => `<span class="coach-tag bad">${t}</span>`).join('');
        html += `
          <div class="coach-move-item bad">
            <div class="coach-move-top">
              <div class="coach-move-id">
                <span class="coach-letter bad">✕</span>
                <strong>${warn.coord}</strong>
                <span class="quality-tag bad">Không nên đi</span>
              </div>
            </div>
            <div class="coach-tags">${tagsHtml}</div>
            <p class="coach-reason">${warn.reason}</p>
          </div>
        `;
      }
      html += '</div>';
    }

    bodyEl.innerHTML = html;
    bodyEl.querySelectorAll('.coach-play-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const px = parseInt(btn.dataset.x, 10);
        const py = parseInt(btn.dataset.y, 10);
        handleSandboxClick(px, py);
      });
    });

    state.coachActive = true;
    card.hidden = false;
    syncCoachButtons();
  }

  function showSandboxCoachReview() {
    if (state.botThinking || !state.lastPlayerBeforeEngine || !state.lastPlayerMove) return;
    const mv = state.lastPlayerMove;
    const evalRes = state.lastPlayerBeforeEngine.evaluatePlayedMove(mv.x, mv.y, mv.color, getActiveKomi());
    if (!evalRes) return;

    const annotations = [];
    if (sandboxEngine.get(mv.x, mv.y) === mv.color) {
      annotations.push({
        x: mv.x,
        y: mv.y,
        type: 'circle',
        color: evalRes.grade === 'mistake' ? '#dc2626' : evalRes.grade === 'inaccurate' ? '#d97706' : '#16a34a'
      });
    }
    if (evalRes.bestMove && sandboxEngine.get(evalRes.bestMove.x, evalRes.bestMove.y) === 0) {
      annotations.push({
        x: evalRes.bestMove.x,
        y: evalRes.bestMove.y,
        type: 'label',
        badge: true,
        text: 'A',
        color: '#16a34a'
      });
    }
    sandboxRenderer.setAnnotations(annotations);

    const card = document.getElementById('sandboxCoachCard');
    const titleEl = document.getElementById('sandboxCoachTitle');
    const bodyEl = document.getElementById('sandboxCoachBody');
    const colorName = mv.color === BLACK ? '⚫ Đen' : '⚪ Trắng';
    titleEl.textContent = `🔎 Phân tích nước vừa đi (${colorName} ${evalRes.playedCoord})`;

    const tagsHtml = evalRes.tags.map((t) => `<span class="coach-tag">${t}</span>`).join('');
    let html = `
      <div class="coach-grade-banner ${evalRes.grade}">
        <strong>${evalRes.gradeLabel}</strong>
        <p>${evalRes.summary}</p>
      </div>
      <div class="coach-move-item ${evalRes.grade === 'mistake' ? 'bad' : evalRes.grade === 'inaccurate' ? 'ok' : 'good'}">
        <div class="coach-move-top">
          <div class="coach-move-id">
            <strong>Nước bạn đi: ${evalRes.playedCoord}</strong>
          </div>
        </div>
        <div class="coach-tags">${tagsHtml}</div>
        <p class="coach-reason">${evalRes.playedReason}</p>
      </div>
    `;

    if (evalRes.bestMove) {
      const alt = evalRes.bestMove;
      const altTags = alt.tags.map((t) => `<span class="coach-tag">${t}</span>`).join('');
      const undoOffer =
        (evalRes.grade === 'mistake' || evalRes.grade === 'inaccurate') && state.sandboxPhase === 'playing'
          ? '<button type="button" class="btn btn-sm btn-secondary coach-undo-btn">↩ Đi lại để sửa nước này</button>'
          : '';
      html += `
        <div class="coach-move-item best">
          <div class="coach-move-top">
            <div class="coach-move-id">
              <span class="coach-letter best">A</span>
              <strong>Đề xuất tốt hơn: ${alt.coord}</strong>
            </div>
            ${undoOffer}
          </div>
          <div class="coach-tags">${altTags}</div>
          <p class="coach-reason">${alt.reason}</p>
        </div>
      `;
    }

    bodyEl.innerHTML = html;
    const undoBtn = bodyEl.querySelector('.coach-undo-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        document.getElementById('sandboxUndoBtn').click();
      });
    }

    state.coachActive = true;
    card.hidden = false;
    syncCoachButtons();
  }

  function toggleSandboxDeadGroup(x, y) {
    if (sandboxEngine.get(x, y) === 0) return;
    const total = sandboxEngine.size * sandboxEngine.size;
    if (!state.sandboxDeadMap || state.sandboxDeadMap.length !== total) {
      state.sandboxDeadMap = new Uint8Array(total);
    }
    const grp = sandboxEngine.getGroup(x, y);
    if (!grp) return;
    const firstIdx = sandboxEngine.idx(grp.stones[0].x, grp.stones[0].y);
    const nextVal = state.sandboxDeadMap[firstIdx] === 1 ? 0 : 1;
    for (const st of grp.stones) {
      state.sandboxDeadMap[sandboxEngine.idx(st.x, st.y)] = nextVal;
    }
    audio.playPreviewTick();
    renderSandboxScore();
  }

  function handleSandboxClick(x, y) {
    if (state.botThinking) return;
    if (state.sandboxPhase === 'scoring') {
      toggleSandboxDeadGroup(x, y);
      return;
    }
    if (state.sandboxPhase === 'finished') {
      setSandboxNotice('info', 'Ván cờ đã kết thúc! Nhấn "Sửa quân chết" hoặc "Ván mới" để chơi tiếp.');
      return;
    }
    if (state.sandboxMode === 'bot' && sandboxEngine.turn !== state.playerColor) return;

    const moverColor = sandboxEngine.turn;
    const beforeSnap = sandboxEngine.clone();
    const res = sandboxEngine.playMove(x, y, moverColor);
    if (!res.ok) {
      audio.playSoftError();
      const msg =
        res.reason === 'ko'
          ? 'Vi phạm Luật Cướp (Ko): phải đi 1 nước chỗ khác trước khi ăn trả!'
          : res.reason === 'suicide'
            ? 'Vi phạm Luật Tự Sát: không thể đi vào ô 0 khí!'
            : 'Giao điểm này đã có quân.';
      setSandboxNotice('error', msg);
      return;
    }

    state.lastPlayerBeforeEngine = beforeSnap;
    state.lastPlayerMove = { x, y, color: moverColor };
    clearSandboxCoach();
    setSandboxNotice(null);
    audio.playStone({ isCapture: res.captured.length > 0, captureCount: res.captured.length });
    if (state.sandboxShowScore) renderSandboxScore();
    sandboxRenderer.render();
    updateSandboxStats();

    if (state.sandboxMode === 'bot' && sandboxEngine.turn === getBotColor()) {
      triggerBotTurn();
    }
  }

  function triggerBotTurn() {
    const botColor = getBotColor();
    state.botThinking = true;
    updateSandboxStats();
    setTimeout(() => {
      const move = sandboxEngine.getBotMove(botColor, state.botRank, getActiveKomi());
      if (move) {
        const res = sandboxEngine.playMove(move.x, move.y, botColor);
        if (res.ok) {
          audio.playStone({ isCapture: res.captured.length > 0, captureCount: res.captured.length });
        }
        state.botThinking = false;
        if (state.sandboxShowScore) renderSandboxScore();
        sandboxRenderer.render();
        updateSandboxStats();
      } else {
        const passRes = sandboxEngine.pass();
        state.botThinking = false;
        sandboxRenderer.render();
        updateSandboxStats();
        if (passRes.gameOver) {
          enterSandboxScoringPhase(
            'Hai bên đã Bỏ lượt liên tiếp — ván cờ kết thúc! Hệ thống đã tự nhận diện quân chết, hãy kiểm tra và nhấn "Chốt kết quả".'
          );
        } else {
          if (state.sandboxShowScore) renderSandboxScore();
          setSandboxNotice('info', 'Máy đã Bỏ lượt (Pass). Tới lượt bạn (hoặc nhấn "Bỏ lượt" / "Kết thúc" để đếm điểm)!');
        }
      }
    }, 45);
  }

  // ==================== TAB 4: GLOSSARY ====================
  function renderGlossary() {
    const grid = document.getElementById('glossaryGrid');
    grid.innerHTML = '';
    const q = state.glossaryQuery.trim().toLowerCase();

    const filtered = GLOSSARY.filter((item) => {
      if (state.glossaryCat !== 'all' && item.category !== state.glossaryCat) return false;
      if (!q) return true;
      return (
        item.term.toLowerCase().includes(q) ||
        item.jp.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="card" style="padding:20px">Không tìm thấy thuật ngữ phù hợp.</div>';
      return;
    }

    for (const item of filtered) {
      const card = document.createElement('article');
      card.className = 'glossary-card card';
      card.innerHTML = `
        <div class="glossary-card-top">
          <div>
            <h4>${item.term}</h4>
            <div class="glossary-jp">${item.jp}</div>
          </div>
          <span class="badge">${item.category}</span>
        </div>
        <p>${item.desc}</p>
        <div>
          <button class="btn btn-sm btn-ghost">Xem bài học liên quan →</button>
        </div>
      `;
      card.querySelector('button').addEventListener('click', () => {
        openLesson(item.lessonId, 'demo');
        switchTab('trainer');
      });
      grid.appendChild(card);
    }
  }

  // ==================== BOOTSTRAP ====================
  function bindEvents() {
    // Unlock Web Audio cleanly on first interaction (respects browser autoplay policy)
    const unlockOnce = () => {
      audio.unlock();
      if (state.musicEnabled) audio.setMusicEnabled(true, true);
      if (state.rainEnabled) audio.setRainEnabled(true, true);
    };
    window.addEventListener('pointerdown', unlockOnce, { once: true });
    window.addEventListener('keydown', unlockOnce, { once: true });

    document.querySelectorAll('.nav-tab, .bottom-nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    document.getElementById('brandHome').addEventListener('click', () => switchTab('roadmap'));

    // Topbar audio / studio / theme buttons
    const toggleSfx = () => {
      state.sfxEnabled = !state.sfxEnabled;
      syncAudioControls();
      savePrefs();
      if (state.sfxEnabled) audio.playStone();
    };
    document.getElementById('soundToggleBtn').addEventListener('click', toggleSfx);
    document.getElementById('sfxToggleBtn').addEventListener('click', toggleSfx);

    const toggleMusic = () => {
      state.musicEnabled = !state.musicEnabled;
      audio.setMusicEnabled(state.musicEnabled, true);
      syncAudioControls();
      savePrefs();
    };
    document.getElementById('musicToggleBtn').addEventListener('click', toggleMusic);
    document.getElementById('studioMusicToggleBtn').addEventListener('click', toggleMusic);

    document.getElementById('studioToggleBtn').addEventListener('click', () => {
      const panel = document.getElementById('studioPanel');
      if (!panel.classList.contains('open')) openStudio();
      else closeStudio();
    });
    document.getElementById('closeStudioBtn').addEventListener('click', closeStudio);
    document.getElementById('studioBackdrop').addEventListener('click', closeStudio);

    document.getElementById('sfxVolumeSlider').addEventListener('input', (e) => {
      state.sfxVolume = Number(e.target.value) / 100;
      syncAudioControls();
      savePrefs();
    });
    document.getElementById('testAsmrBtn').addEventListener('click', () => {
      state.sfxEnabled = true;
      syncAudioControls();
      savePrefs();
      audio.playStone();
    });
    document.getElementById('testCaptureBtn').addEventListener('click', () => {
      state.sfxEnabled = true;
      syncAudioControls();
      savePrefs();
      audio.playStone({ isCapture: true, captureCount: 3 });
    });

    document.getElementById('musicVolumeSlider').addEventListener('input', (e) => {
      state.musicVolume = Number(e.target.value) / 100;
      syncAudioControls();
      savePrefs();
    });

    document.getElementById('musicTrackGroup').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.musicTrack = btn.dataset.track;
      if (!state.musicEnabled) {
        state.musicEnabled = true;
        audio.setMusicEnabled(true, true);
      }
      audio.setMusicTrack(state.musicTrack);
      syncAudioControls();
      savePrefs();
    });

    document.getElementById('rainToggleBtn').addEventListener('click', () => {
      state.rainEnabled = !state.rainEnabled;
      audio.setRainEnabled(state.rainEnabled, true);
      syncAudioControls();
      savePrefs();
    });

    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme();
      savePrefs();
    });

    const toggleTouchConfirm = () => {
      state.touchConfirm = !state.touchConfirm;
      savePrefs();
      syncTouchConfirmButtons();
    };
    document.getElementById('trainerTouchModeBtn').addEventListener('click', toggleTouchConfirm);
    document.getElementById('sandboxTouchModeBtn').addEventListener('click', toggleTouchConfirm);

    // Touch Confirm bars
    document.getElementById('trainerConfirmBtn').addEventListener('click', () => {
      trainerRenderer.confirmPendingMove();
    });
    document.getElementById('trainerCancelMoveBtn').addEventListener('click', () => {
      trainerRenderer.clearPendingMove();
    });
    document.getElementById('sandboxConfirmBtn').addEventListener('click', () => {
      sandboxRenderer.confirmPendingMove();
    });
    document.getElementById('sandboxCancelMoveBtn').addEventListener('click', () => {
      sandboxRenderer.clearPendingMove();
    });

    // Roadmap CTAs
    document.getElementById('heroStartBtn').addEventListener('click', () => {
      const firstUnsolved = LESSONS.find((l) => !state.solvedLessons.has(l.id)) || LESSONS[0];
      openLesson(firstUnsolved.id, 'demo');
      switchTab('trainer');
    });
    document.getElementById('heroSandboxBtn').addEventListener('click', () => switchTab('sandbox'));

    // Mobile drawer & lesson quick nav
    document.getElementById('mobileLessonTrigger').addEventListener('click', openLessonDrawer);
    document.getElementById('closeDrawerBtn').addEventListener('click', closeLessonDrawer);
    document.getElementById('lessonDrawerBackdrop').addEventListener('click', closeLessonDrawer);
    document.getElementById('mobilePrevLessonBtn').addEventListener('click', () => goToAdjacentLesson(-1));
    document.getElementById('mobileNextLessonBtn').addEventListener('click', () => goToAdjacentLesson(1));

    // Theory collapse on mobile
    document.getElementById('theoryAccordionToggle').addEventListener('click', () => {
      if (window.innerWidth > 1080) return;
      state.theoryExpanded = !state.theoryExpanded;
      syncTheoryAccordion();
    });
    window.addEventListener('resize', syncTheoryAccordion);

    // Trainer filters & mode
    document.getElementById('lessonFilterChips').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.lessonFilter = chip.dataset.filter;
      document.querySelectorAll('#lessonFilterChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderLessonSidebar();
    });

    document.getElementById('modeDemoBtn').addEventListener('click', () => setTrainerMode('demo'));
    document.getElementById('modePuzzleBtn').addEventListener('click', () => setTrainerMode('puzzle'));
    document.getElementById('puzzleSwitchDemoBtn').addEventListener('click', () => setTrainerMode('demo'));
    document.getElementById('demoStartPuzzleBtn').addEventListener('click', () => setTrainerMode('puzzle'));

    document.getElementById('trainerZoomBtn').addEventListener('click', () => {
      state.trainerZoomed = !state.trainerZoomed;
      updateZoomButton();
    });
    document.getElementById('trainerLibertiesBtn').addEventListener('click', (e) => {
      state.trainerShowLiberties = !state.trainerShowLiberties;
      e.currentTarget.classList.toggle('active-toggle', state.trainerShowLiberties);
      trainerRenderer.setShowLiberties(state.trainerShowLiberties);
    });

    // Demo stepper
    document.getElementById('demoFirstBtn').addEventListener('click', () => {
      stopDemoAutoplay();
      applyDemoStep(0, false);
    });
    document.getElementById('demoPrevBtn').addEventListener('click', () => {
      stopDemoAutoplay();
      applyDemoStep(state.demoStepIndex - 1, true);
    });
    document.getElementById('demoNextBtn').addEventListener('click', () => {
      stopDemoAutoplay();
      applyDemoStep(state.demoStepIndex + 1, true);
    });
    document.getElementById('demoLastBtn').addEventListener('click', () => {
      stopDemoAutoplay();
      const steps = getActiveVariation(getCurrentLesson()).steps || [];
      applyDemoStep(steps.length - 1, true);
    });
    document.getElementById('demoPlayBtn').addEventListener('click', toggleDemoAutoplay);

    // Puzzle controls
    document.getElementById('puzzleHintBtn').addEventListener('click', showPuzzleHint);
    document.getElementById('puzzleRetryBtn').addEventListener('click', initPuzzle);
    document.getElementById('prevLessonBtn').addEventListener('click', () => goToAdjacentLesson(-1));
    document.getElementById('nextLessonBtn').addEventListener('click', () => goToAdjacentLesson(1));
    document.getElementById('feedbackNextLessonBtn').addEventListener('click', () => goToAdjacentLesson(1));
    document.getElementById('feedbackCompareBtn').addEventListener('click', () => {
      const lesson = getCurrentLesson();
      const variations = getLessonVariations(lesson);
      let targetIdx = 0;
      if (state.lastWrongCoord) {
        const matched = variations.findIndex((v) => {
          const mv = getFirstMoveOfVariation(v);
          return mv && `${mv.x},${mv.y}` === state.lastWrongCoord;
        });
        if (matched >= 0) targetIdx = matched;
        else {
          const firstBad = variations.findIndex((v) => v.kind === 'bad');
          if (firstBad >= 0) targetIdx = firstBad;
        }
      } else {
        const firstGood = variations.findIndex((v) => v.kind === 'good' && getFirstMoveOfVariation(v));
        if (firstGood >= 0) targetIdx = firstGood;
      }
      state.demoVariationIndex = targetIdx;
      setTrainerMode('demo');
      const steps = (variations[targetIdx] && variations[targetIdx].steps) || [];
      applyDemoStep(steps.length > 1 ? 1 : 0, true);
    });

    // Sandbox controls
    document.getElementById('mobileSandboxSettingsBtn').addEventListener('click', openSandboxSettings);
    document.getElementById('closeSandboxSettingsBtn').addEventListener('click', closeSandboxSettings);
    document.getElementById('sandboxSettingsBackdrop').addEventListener('click', closeSandboxSettings);

    document.getElementById('sandboxSizeGroup').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.sandboxSize = parseInt(btn.dataset.size, 10);
      initSandbox();
    });
    document.getElementById('sandboxModeGroup').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.sandboxMode = btn.dataset.mode;
      initSandbox();
    });
    document.getElementById('botRankGroup').addEventListener('click', (e) => {
      const pill = e.target.closest('.rank-pill');
      if (!pill) return;
      state.botRank = pill.dataset.rank;
      savePrefs();
      syncSandboxSettingsUI();
      updateSandboxStats();
    });
    document.getElementById('sandboxPlayerColorGroup').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.playerColor = parseInt(btn.dataset.color, 10);
      savePrefs();
      initSandbox();
    });
    document.getElementById('sandboxHandicapGroup').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.handicap = parseInt(btn.dataset.handicap, 10);
      savePrefs();
      initSandbox();
    });
    document.getElementById('sandboxUndoBtn').addEventListener('click', () => {
      if (state.botThinking) return;
      if (state.sandboxPhase !== 'playing') {
        resumeSandboxPlay();
        return;
      }
      if (sandboxEngine.history.length === 0) return;
      sandboxEngine.undo();
      if (state.sandboxMode === 'bot' && sandboxEngine.turn !== state.playerColor && sandboxEngine.history.length > 0) {
        sandboxEngine.undo();
      }
      state.lastPlayerBeforeEngine = null;
      state.lastPlayerMove = null;
      clearSandboxCoach();
      if (state.sandboxShowScore) renderSandboxScore();
      sandboxRenderer.render();
      updateSandboxStats();
      setSandboxNotice(null);
    });
    document.getElementById('sandboxCoachHintBtn').addEventListener('click', showSandboxCoachHint);
    document.getElementById('sandboxCoachReviewBtn').addEventListener('click', showSandboxCoachReview);
    document.getElementById('sandboxCoachClearBtn').addEventListener('click', clearSandboxCoach);
    document.getElementById('closeCoachCardBtn').addEventListener('click', clearSandboxCoach);
    document.getElementById('sandboxPassBtn').addEventListener('click', () => {
      if (state.botThinking || state.sandboxPhase !== 'playing') return;
      const res = sandboxEngine.pass();
      updateSandboxStats();
      if (res.gameOver) {
        enterSandboxScoringPhase(
          'Hai bên đã Bỏ lượt liên tiếp — ván cờ kết thúc! Hệ thống đã tự nhận diện quân chết, hãy kiểm tra và nhấn "Chốt kết quả".'
        );
      } else if (state.sandboxMode === 'bot' && sandboxEngine.turn === getBotColor()) {
        setSandboxNotice('info', 'Bạn đã Bỏ lượt. Đợi máy phản hồi...');
        triggerBotTurn();
      } else {
        setSandboxNotice('info', 'Đã Bỏ lượt.');
      }
    });
    document.getElementById('sandboxLibertiesBtn').addEventListener('click', (e) => {
      state.sandboxShowLiberties = !state.sandboxShowLiberties;
      e.currentTarget.classList.toggle('active-toggle', state.sandboxShowLiberties);
      sandboxRenderer.setShowLiberties(state.sandboxShowLiberties);
    });
    document.getElementById('sandboxScoreBtn').addEventListener('click', (e) => {
      if (state.sandboxPhase !== 'playing') {
        state.sandboxShowScore = true;
        e.currentTarget.classList.add('active-toggle');
        renderSandboxScore();
        return;
      }
      state.sandboxShowScore = !state.sandboxShowScore;
      e.currentTarget.classList.toggle('active-toggle', state.sandboxShowScore);
      renderSandboxScore();
    });
    document.getElementById('sandboxFinishBtn').addEventListener('click', () => {
      if (state.botThinking) return;
      if (state.sandboxPhase === 'playing') {
        enterSandboxScoringPhase();
      } else if (state.sandboxPhase === 'scoring') {
        finalizeSandboxScore();
      } else {
        state.sandboxShowScore = true;
        renderSandboxScore();
      }
    });
    document.getElementById('sandboxScoreRuleSwitch').addEventListener('click', (e) => {
      const btn = e.target.closest('.seg-btn');
      if (!btn) return;
      state.sandboxScoreRule = btn.dataset.rule === 'chinese' ? 'chinese' : 'japanese';
      renderSandboxScore();
    });
    document.getElementById('sandboxConfirmScoreBtn').addEventListener('click', finalizeSandboxScore);
    document.getElementById('sandboxAutoDeadBtn').addEventListener('click', () => {
      if (state.sandboxPhase !== 'scoring') return;
      state.sandboxDeadMap = sandboxEngine.detectDeadStones(getActiveKomi());
      audio.playPreviewTick();
      renderSandboxScore();
    });
    document.getElementById('sandboxEditDeadBtn').addEventListener('click', () => {
      state.sandboxPhase = 'scoring';
      sandboxRenderer.setScoringMode(true);
      renderSandboxScore();
      setSandboxNotice('info', 'Đang sửa quân chết: chạm vào quân cờ trên bàn rồi nhấn "Chốt kết quả".');
    });
    document.getElementById('sandboxResumeGameBtn').addEventListener('click', resumeSandboxPlay);
    document.getElementById('sandboxNewGameFromScoreBtn').addEventListener('click', initSandbox);
    document.getElementById('sandboxResetBtn').addEventListener('click', initSandbox);

    // Glossary controls
    document.getElementById('glossarySearchInput').addEventListener('input', (e) => {
      state.glossaryQuery = e.target.value;
      renderGlossary();
    });
    document.getElementById('glossaryCategoryChips').addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state.glossaryCat = chip.dataset.cat;
      document.querySelectorAll('#glossaryCategoryChips .chip').forEach((c) => c.classList.toggle('active', c === chip));
      renderGlossary();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'Escape') {
        closeLessonDrawer();
        closeStudio();
        closeSandboxSettings();
        return;
      }
      if (state.activeTab !== 'trainer') return;
      if (state.trainerMode === 'demo') {
        if (e.key === 'ArrowLeft') {
          stopDemoAutoplay();
          applyDemoStep(state.demoStepIndex - 1, true);
        } else if (e.key === 'ArrowRight') {
          stopDemoAutoplay();
          applyDemoStep(state.demoStepIndex + 1, true);
        }
      } else if (state.trainerMode === 'puzzle') {
        if (e.key.toLowerCase() === 'r') initPuzzle();
        else if (e.key.toLowerCase() === 'h') showPuzzleHint();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadPrefs();
    applyTheme();

    trainerRenderer = new GobanRenderer(document.getElementById('trainerCanvas'), {
      skinId: state.boardSkin,
      touchConfirm: state.touchConfirm,
      onCellClick: handleTrainerBoardClick,
      onPendingMoveChange: (pending) => {
        const bar = document.getElementById('trainerConfirmBar');
        bar.hidden = !pending;
        if (pending) {
          audio.playPreviewTick();
          document.getElementById('trainerConfirmLabel').textContent =
            `Xem trước nước đi: ${pending.coordStr}`;
        }
      }
    });

    sandboxRenderer = new GobanRenderer(document.getElementById('sandboxCanvas'), {
      skinId: state.boardSkin,
      touchConfirm: state.touchConfirm,
      onCellClick: handleSandboxClick,
      onPendingMoveChange: (pending) => {
        const bar = document.getElementById('sandboxConfirmBar');
        bar.hidden = !pending;
        if (pending) {
          audio.playPreviewTick();
          document.getElementById('sandboxConfirmLabel').textContent =
            `Xem trước nước đi: ${pending.coordStr}`;
        }
      }
    });

    renderSkinPickers();
    applySkin(state.boardSkin, false);
    syncAudioControls();
    bindEvents();
    syncTouchConfirmButtons();
    updateGlobalProgress();
    renderRoadmap();
    openLesson(state.currentLessonId, 'demo');
    initSandbox();
    renderGlossary();
  });
})(window);
