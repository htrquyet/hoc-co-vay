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
    touchConfirm: isCoarsePointerDevice(),
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
    demoStepIndex: 0,
    demoTimer: null,
    trainerShowLiberties: false,
    trainerZoomed: true,
    puzzleNode: null,
    puzzleLocked: false,
    theoryExpanded: !isCoarsePointerDevice(),
    // Sandbox
    sandboxSize: 9,
    sandboxMode: 'bot',
    botRank: '1d',
    playerColor: BLACK,
    handicap: 0,
    sandboxShowLiberties: false,
    sandboxShowScore: false,
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
    if (!document.getElementById('lessonDrawer').classList.contains('open')) {
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
    if (doneCount >= 24) return '1 Dan (Thành thạo)';
    if (doneCount >= 22) return '2 Kyu (Cao cấp)';
    if (doneCount >= 19) return '5 Kyu (Khá giỏi)';
    if (doneCount >= 15) return '8 Kyu (Trung cấp)';
    if (doneCount >= 10) return '15 Kyu (Sơ trung cấp)';
    if (doneCount >= 4) return '20 Kyu (Cơ bản)';
    return '30 Kyu (Nhập môn)';
  }

  function updateGlobalProgress() {
    const total = LESSONS.length;
    const done = state.solvedLessons.size;
    const pct = total ? Math.round((done / total) * 100) : 0;

    document.getElementById('overallProgressText').textContent = `${done}/${total} thế cờ`;
    document.getElementById('sidebarProgressBadge').textContent = `${done}/${total}`;
    document.getElementById('roadmapRankBadge').textContent = estimateRankLabel(done);
    document.getElementById('roadmapProgressCaption').textContent = `${done}/${total} bài (${pct}%)`;
    document.getElementById('roadmapProgressBar').style.width = `${pct}%`;
  }

  function closeLessonDrawer() {
    document.getElementById('lessonDrawer').classList.remove('open');
    document.getElementById('lessonDrawerBackdrop').hidden = true;
    if (!document.getElementById('studioPanel').classList.contains('open')) {
      document.body.classList.remove('modal-open');
    }
  }

  function openLessonDrawer() {
    closeStudio();
    document.getElementById('lessonDrawer').classList.add('open');
    document.getElementById('lessonDrawerBackdrop').hidden = false;
    document.body.classList.add('modal-open');
  }

  function switchTab(tabId) {
    stopDemoAutoplay();
    closeLessonDrawer();
    closeStudio();
    state.activeTab = tabId;

    document.querySelectorAll('.nav-tab, .bottom-nav-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-panel').forEach((panel) => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });

    if (tabId === 'trainer' && trainerRenderer) {
      trainerRenderer.resize();
    } else if (tabId === 'sandbox' && sandboxRenderer) {
      sandboxRenderer.resize();
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
      heroBtn.textContent = '🎉 Đã xong 24/24 bài — Ôn lại từ đầu →';
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

  function openLesson(lessonId, preferredMode = 'demo') {
    stopDemoAutoplay();
    state.currentLessonId = lessonId;
    state.trainerMode = preferredMode;
    state.demoStepIndex = 0;
    state.trainerZoomed = true;
    savePrefs();

    const lesson = getCurrentLesson();
    renderLessonSidebar();

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
      applyDemoStep(0, false);
    } else {
      initPuzzle();
    }
  }

  function applyDemoStep(stepIndex, withAudio = true) {
    const lesson = getCurrentLesson();
    const steps = lesson.demoSteps || [];
    const clamped = Math.max(0, Math.min(stepIndex, steps.length - 1));
    state.demoStepIndex = clamped;

    trainerEngine = new GoEngine(lesson.boardSize);
    trainerEngine.setPosition(lesson.demoInitialPosition || lesson.puzzle.initialPosition, BLACK);

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
    trainerRenderer.setEngine(trainerEngine);
    trainerRenderer.setInteractive(false);
    trainerRenderer.setTerritoryMap(null);
    trainerRenderer.setAnnotations(currentStep.markers || []);
    updateZoomButton();

    document.getElementById('demoStepCounter').textContent = `${clamped + 1}/${steps.length}`;
    document.getElementById('demoCaptionText').textContent = currentStep.caption;
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
    if (state.demoStepIndex >= lesson.demoSteps.length - 1) {
      applyDemoStep(0, false);
    }
    document.getElementById('demoPlayBtn').textContent = '⏸ Tạm dừng';
    state.demoTimer = setInterval(() => {
      if (state.demoStepIndex >= lesson.demoSteps.length - 1) {
        stopDemoAutoplay();
        return;
      }
      applyDemoStep(state.demoStepIndex + 1, true);
    }, 1650);
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

  function setFeedback(kind, text, showNextCta = false) {
    const box = document.getElementById('puzzleFeedbackBox');
    const txt = document.getElementById('puzzleFeedbackText');
    const nextBtn = document.getElementById('feedbackNextLessonBtn');
    if (!kind || !text) {
      box.hidden = true;
      txt.textContent = '';
      nextBtn.hidden = true;
      return;
    }
    box.hidden = false;
    box.className = `feedback-box ${kind}`;
    txt.textContent = text;
    const idx = LESSONS.findIndex((l) => l.id === state.currentLessonId);
    nextBtn.hidden = !showNextCta || idx >= LESSONS.length - 1;
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
      audio.playSoftError();
      setFeedback('error', `${lesson.puzzle.defaultWrongFeedback} Nhấn "Thử lại" để đánh lại.`);
      return;
    }

    if (branch.status === 'solved') {
      state.puzzleLocked = true;
      state.solvedLessons.add(lesson.id);
      savePrefs();
      updateGlobalProgress();
      renderRoadmap();
      renderLessonSidebar();
      document.getElementById('detailSolvedBadge').hidden = false;
      setFeedback('success', `🎉 ${branch.feedback}`, true);
      setTimeout(() => audio.playSolved(), 140);
      return;
    }

    if (branch.status === 'wrong') {
      state.puzzleLocked = true;
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
      setFeedback('error', `❌ ${branch.feedback} Nhấn "Thử lại" để thử hướng khác.`);
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
  }

  function initSandbox() {
    sandboxEngine = new GoEngine(state.sandboxSize);
    if (state.sandboxMode === 'bot' && state.handicap >= 2) {
      sandboxEngine.setupHandicap(state.handicap);
    }
    state.sandboxShowScore = false;
    state.botThinking = false;
    sandboxRenderer.setEngine(sandboxEngine);
    sandboxRenderer.setTerritoryMap(null);
    sandboxRenderer.setInteractive(true);
    sandboxRenderer.setHoverColor(sandboxEngine.turn);
    document.getElementById('sandboxScoreCard').hidden = true;
    document.getElementById('sandboxScoreBtn').classList.remove('active-toggle');
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

    document.getElementById('sandboxMoveCount').textContent = String(sandboxEngine.moveCount);
    document.getElementById('sandboxBlackCaps').textContent = `${sandboxEngine.captures[BLACK]} tù binh`;
    document.getElementById('sandboxWhiteCaps').textContent = `${sandboxEngine.captures[WHITE]} tù binh`;
    sandboxRenderer.setHoverColor(sandboxEngine.turn);
  }

  function renderSandboxScore() {
    const komi = getActiveKomi();
    const sc = sandboxEngine.estimateScore(komi);
    sandboxRenderer.setTerritoryMap(state.sandboxShowScore ? sc.territoryMap : null);
    const card = document.getElementById('sandboxScoreCard');
    card.hidden = !state.sandboxShowScore;
    if (!state.sandboxShowScore) return;

    const winnerName = sc.winner === BLACK ? '⚫ Đen thắng' : '⚪ Trắng thắng';
    document.getElementById('sandboxScoreBody').innerHTML = `
      <div class="score-row"><span>Đất Đen + Tù binh</span><strong>${sc.blackTerritory} + ${sc.blackCaptures} = ${sc.blackTotal}</strong></div>
      <div class="score-row"><span>Đất Trắng + Tù binh + Komi</span><strong>${sc.whiteTerritory} + ${sc.whiteCaptures} + ${sc.komi} = ${sc.whiteTotal}</strong></div>
      <div class="score-row score-winner"><span>Kết quả ước lượng</span><span>${winnerName} (+${sc.margin.toFixed(1)} điểm)</span></div>
    `;
  }

  function handleSandboxClick(x, y) {
    if (state.botThinking) return;
    if (state.sandboxMode === 'bot' && sandboxEngine.turn !== state.playerColor) return;

    const res = sandboxEngine.playMove(x, y, sandboxEngine.turn);
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
      } else {
        const passRes = sandboxEngine.pass();
        setSandboxNotice(
          'info',
          passRes.gameOver
            ? 'Hai bên đều Bỏ lượt — ván cờ kết thúc! Nhấn "Đếm điểm" để xem kết quả.'
            : 'Máy đã Bỏ lượt (Pass). Tới lượt bạn!'
        );
      }
      state.botThinking = false;
      if (state.sandboxShowScore) renderSandboxScore();
      sandboxRenderer.render();
      updateSandboxStats();
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
      const lesson = getCurrentLesson();
      applyDemoStep((lesson.demoSteps || []).length - 1, true);
    });
    document.getElementById('demoPlayBtn').addEventListener('click', toggleDemoAutoplay);

    // Puzzle controls
    document.getElementById('puzzleHintBtn').addEventListener('click', showPuzzleHint);
    document.getElementById('puzzleRetryBtn').addEventListener('click', initPuzzle);
    document.getElementById('prevLessonBtn').addEventListener('click', () => goToAdjacentLesson(-1));
    document.getElementById('nextLessonBtn').addEventListener('click', () => goToAdjacentLesson(1));
    document.getElementById('feedbackNextLessonBtn').addEventListener('click', () => goToAdjacentLesson(1));

    // Sandbox controls
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
      if (sandboxEngine.history.length === 0) return;
      sandboxEngine.undo();
      if (state.sandboxMode === 'bot' && sandboxEngine.turn !== state.playerColor && sandboxEngine.history.length > 0) {
        sandboxEngine.undo();
      }
      if (state.sandboxShowScore) renderSandboxScore();
      sandboxRenderer.render();
      updateSandboxStats();
      setSandboxNotice(null);
    });
    document.getElementById('sandboxPassBtn').addEventListener('click', () => {
      if (state.botThinking) return;
      const res = sandboxEngine.pass();
      updateSandboxStats();
      if (res.gameOver) {
        state.sandboxShowScore = true;
        renderSandboxScore();
        setSandboxNotice('info', 'Hai bên đều Bỏ lượt — ván cờ kết thúc và đã tự động đếm điểm!');
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
      state.sandboxShowScore = !state.sandboxShowScore;
      e.currentTarget.classList.toggle('active-toggle', state.sandboxShowScore);
      renderSandboxScore();
    });
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
