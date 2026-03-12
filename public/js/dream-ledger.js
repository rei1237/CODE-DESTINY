(function () {
  var DREAM_ARCHIVE_KEY = 'dreamLedgerArchiveV1';
  var state = {
    reading: null,
    stageDone: { 1: false, 2: false, 3: false },
    nextStage: 1,
    visibleStage: 1,
    textSpeed: 1,
    typingTimer: null,
    typingStage: 0
  };

  var bodyLockState = {
    locked: false,
    overflow: '',
    position: '',
    top: '',
    width: '',
    htmlOverflow: ''
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setBodyLock(locked) {
    if (locked) {
      if (bodyLockState.locked) return;
      var docEl = document.documentElement;
      bodyLockState.overflow = document.body.style.overflow || '';
      bodyLockState.position = document.body.style.position || '';
      bodyLockState.top = document.body.style.top || '';
      bodyLockState.width = document.body.style.width || '';
      bodyLockState.htmlOverflow = docEl ? (docEl.style.overflow || '') : '';
      document.body.style.overflow = 'hidden';
      if (docEl) docEl.style.overflow = 'hidden';
      bodyLockState.locked = true;
      return;
    }

    if (!bodyLockState.locked) return;
    var docEl2 = document.documentElement;
    document.body.style.overflow = bodyLockState.overflow;
    document.body.style.position = bodyLockState.position;
    document.body.style.top = bodyLockState.top;
    document.body.style.width = bodyLockState.width;
    if (docEl2) docEl2.style.overflow = bodyLockState.htmlOverflow;
    bodyLockState.locked = false;
  }

  function speedLabel(mult) {
    var n = Number(mult) || 1;
    if (Math.round(n * 10) % 10 === 0) return String(Math.round(n));
    return n.toFixed(1).replace(/\.0$/, '');
  }

  function updateStoryModeLabel() {
    var modeEl = $('dreamStoryMode');
    if (!modeEl) return;
    modeEl.textContent = '꿈의 마법책 낭독 모드 · ' + speedLabel(state.textSpeed) + 'x';
  }

  function renderSpeedButtons() {
    var buttons = document.querySelectorAll('.dream-speed-btn');
    buttons.forEach(function (btn) {
      var v = Number(btn.getAttribute('data-action-args'));
      btn.classList.toggle('is-active', Math.abs(v - state.textSpeed) < 0.01);
    });
    updateStoryModeLabel();
  }

  function stopTyping() {
    if (state.typingTimer) {
      clearInterval(state.typingTimer);
      state.typingTimer = null;
    }
    state.typingStage = 0;
  }

  function scrollStoryToLatest(includePanel) {
    var scrollWrap = $('dreamStoryScroll');
    if (scrollWrap) {
      scrollWrap.scrollTop = scrollWrap.scrollHeight;
    }
    var panel = includePanel ? document.querySelector('.dream-stage-panel') : null;
    if (panel && typeof panel.scrollIntoView === 'function') {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function resetCards() {
    stopTyping();
    var cards = document.querySelectorAll('.dream-ritual-card');
    cards.forEach(function (card) {
      card.classList.remove('is-open');
      card.classList.remove('is-active-card');
    });
    state.stageDone = { 1: false, 2: false, 3: false };
    state.nextStage = 1;
    state.visibleStage = 1;
    var nextBtn = $('dreamNextStageBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    updateVisibleStage(1);
  }

  function updateStageTabs(stage) {
    var tabs = document.querySelectorAll('.dream-stage-tab');
    tabs.forEach(function (tab) {
      var s = Number(tab.getAttribute('data-stage-tab'));
      tab.classList.toggle('is-active', s === stage);
    });
  }

  function updateVisibleStage(stage) {
    state.visibleStage = stage;
    var cards = document.querySelectorAll('.dream-ritual-card');
    cards.forEach(function (card) {
      var s = Number(card.getAttribute('data-dream-stage'));
      card.classList.toggle('is-active-card', s === stage);
      if (s === stage) {
        card.classList.remove('is-summoned');
        window.requestAnimationFrame(function () {
          card.classList.add('is-summoned');
        });
      }
    });
    updateStageTabs(stage);
    scrollStoryToLatest(true);
  }

  function setWizardLine(text) {
    var line = $('dreamWizardLine');
    if (line) line.textContent = text;
  }

  function typeText(targetEl, text, speed, done) {
    if (state.typingTimer) {
      clearInterval(state.typingTimer);
      state.typingTimer = null;
    }
    var i = 0;
    var source = String(text || '');
    var baseSpeed = Number(speed) || 24;
    var interval = Math.max(8, Math.round(baseSpeed / Math.max(1, Number(state.textSpeed) || 1)));
    targetEl.textContent = '';
    state.typingTimer = setInterval(function () {
      i += 1;
      targetEl.textContent = source.slice(0, i);
      scrollStoryToLatest();
      if (i >= source.length) {
        clearInterval(state.typingTimer);
        state.typingTimer = null;
        if (typeof done === 'function') done();
      }
    }, interval);
  }

  function setLoaderText(text) {
    var loaderText = $('dreamLoaderText');
    if (loaderText) loaderText.textContent = text;
  }

  function syncInputEnergy() {
    var input = $('dreamInput');
    var shell = document.querySelector('.dream-ledger-shell');
    if (!input || !shell) return;
    var len = (input.value || '').trim().length;
    var energy = Math.min(1.35, 0.55 + len / 90);
    shell.style.setProperty('--dream-energy', String(energy));
  }

  function renderKeywordChips(keywords) {
    var wrap = $('dreamKeywordChips');
    if (!wrap) return;
    var list = Array.isArray(keywords) ? keywords.slice(0, 3) : [];
    wrap.innerHTML = list.map(function (kw) {
      return '<span class="dream-keyword-chip">' + kw + '</span>';
    }).join('');
  }

  function renderCardFaces(reading) {
    if (!reading || !Array.isArray(reading.cards)) return;
    for (var i = 0; i < 3; i += 1) {
      var card = reading.cards[i] || {};
      var nameEl = $('dreamCardName' + (i + 1));
      var symbolEl = $('dreamCardSymbol' + (i + 1));
      var artEl = $('dreamCardArt' + (i + 1));
      if (nameEl) nameEl.textContent = '[' + (card.card_name || '미지의 상징') + '] 카드';
      if (symbolEl) symbolEl.textContent = card.symbol || '✦';
      if (artEl) {
        if (card.tarot_image_url) {
          (function (el, url, keyword, sym) {
            var probe = new Image();
            probe.onload = function () {
              el.style.backgroundImage = 'url("' + url + '")';
            };
            probe.onerror = function () {
              el.style.backgroundImage = makeKeywordArt(keyword, sym);
            };
            probe.src = url;
          })(artEl, card.tarot_image_url, card.card_name || '상징', card.symbol || '✦');
        } else {
          artEl.style.backgroundImage = makeKeywordArt(card.card_name || '상징', card.symbol || '✦');
        }
      }
    }
  }

  function readArchive() {
    try {
      var raw = localStorage.getItem(DREAM_ARCHIVE_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (_) {
      return [];
    }
  }

  function writeArchive(items) {
    try {
      localStorage.setItem(DREAM_ARCHIVE_KEY, JSON.stringify(items || []));
    } catch (_) {}
  }

  function formatDate(ts) {
    var d = new Date(ts || Date.now());
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    var hh = String(d.getHours()).padStart(2, '0');
    var mm = String(d.getMinutes()).padStart(2, '0');
    return y + '-' + m + '-' + day + ' ' + hh + ':' + mm;
  }

  function saveCurrentReadingToArchive() {
    if (!state.reading) return false;
    var list = readArchive();
    var id = Date.now() + '-' + Math.random().toString(16).slice(2, 8);
    list.unshift({
      id: id,
      createdAt: Date.now(),
      title: state.reading.title || '드림 타로',
      summary: state.reading.summary || '',
      reading: state.reading
    });
    if (list.length > 30) list = list.slice(0, 30);
    writeArchive(list);
    return true;
  }

  function renderArchiveList() {
    var listEl = $('dreamArchiveList');
    if (!listEl) return;

    var list = readArchive();
    if (!list.length) {
      listEl.innerHTML = '<div class="dream-archive-item"><div class="dream-archive-meta">저장된 해몽이 없습니다. 해몽 후 [꿈 저장소]를 눌러 보관해보세요.</div></div>';
      return;
    }

    listEl.innerHTML = list.map(function (item) {
      var title = item.title || '드림 타로';
      var summary = (item.summary || '').slice(0, 72);
      return '<article class="dream-archive-item">'
        + '<div class="dream-archive-title">' + title + '</div>'
        + '<div class="dream-archive-meta">' + formatDate(item.createdAt) + ' · ' + summary + '</div>'
        + '<div class="dream-archive-actions">'
          + '<button class="dream-ledger-btn dream-ledger-btn--mini" onclick="dreamLoadArchiveAt(\'' + item.id + '\')">다시 보기</button>'
          + '<button class="dream-ledger-btn dream-ledger-btn--mini" onclick="dreamDeleteArchiveAt(\'' + item.id + '\')">삭제</button>'
        + '</div>'
      + '</article>';
    }).join('');
  }

  function hydrateReading(reading) {
    if (!reading) return;
    state.reading = reading;
    $('dreamCardTitle').textContent = state.reading.title;
    $('dreamCardSummary').textContent = state.reading.summary;
    renderKeywordChips(state.reading.keywords);
    renderCardFaces(state.reading);
    $('dreamStageTitle').textContent = '제1장 · 첫 번째 카드가 들려줄 서사를 열어주세요.';
    $('dreamStageText').textContent = '';
    $('dreamFinalSpell').textContent = '';
    var spellWrap = $('dreamFinalSpellWrap');
    if (spellWrap) spellWrap.style.display = 'none';
    var nextBtn = $('dreamNextStageBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    updateVisibleStage(1);
    setWizardLine('카드가 소환되었습니다. 꿈의 마법책이 1장부터 차례대로 이야기를 들려줍니다.');
    updateStoryModeLabel();
    $('dreamLoader').style.display = 'none';
    $('dreamResultWrap').style.display = 'block';
    scrollStoryToLatest();
  }

  function makeKeywordArt(keyword, symbol) {
    var k = String(keyword || '상징').slice(0, 12);
    var s = String(symbol || '✦').slice(0, 2);
    var palette = [
      ['#ffd9a1', '#79c7ff', '#2a3b68'],
      ['#ffcf91', '#95b5ff', '#3b2f66'],
      ['#ffe0b8', '#85d6ff', '#32416f'],
      ['#ffd3a9', '#9cd0ff', '#2e3860']
    ];
    var idx = (k.length + s.charCodeAt(0)) % palette.length;
    var c = palette[idx];
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 230">',
      '<defs>',
      '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
      '<stop offset="0%" stop-color="' + c[2] + '"/>',
      '<stop offset="100%" stop-color="#1f2b4f"/>',
      '</linearGradient>',
      '<radialGradient id="r" cx="0.2" cy="0.2" r="0.8">',
      '<stop offset="0%" stop-color="' + c[0] + '" stop-opacity="0.95"/>',
      '<stop offset="100%" stop-color="' + c[1] + '" stop-opacity="0.05"/>',
      '</radialGradient>',
      '</defs>',
      '<rect width="420" height="230" fill="url(#g)"/>',
      '<rect width="420" height="230" fill="url(#r)"/>',
      '<circle cx="355" cy="48" r="38" fill="' + c[1] + '" fill-opacity="0.2"/>',
      '<circle cx="62" cy="184" r="48" fill="' + c[0] + '" fill-opacity="0.18"/>',
      '<text x="210" y="122" text-anchor="middle" font-size="92" fill="#f4fbff" fill-opacity="0.94">' + s + '</text>',
      '<text x="210" y="196" text-anchor="middle" font-size="28" fill="#fff3df" font-family="serif">' + k + '</text>',
      '</svg>'
    ].join('');
    return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(svg) + '")';
  }

  function stagePayload(s) {
    if (!state.reading) return { title: '', text: '' };
    if (s === 1) return { title: '1단계 · 기원', text: state.reading.scene };
    if (s === 2) return { title: '2단계 · 전언', text: state.reading.symbol };
    return { title: '3단계 · 지침', text: state.reading.echo };
  }

  function normalizedFinalSpell(reading) {
    var raw = reading && reading.finalSpell ? String(reading.finalSpell) : '';
    var cleaned = raw
      .replace(/^\s*오늘의\s*행운\s*주문\s*:\s*/i, '')
      .replace(/^\s*오늘의\s*주문\s*:\s*/i, '')
      .replace(/^\s*행운\s*주문\s*:\s*/i, '')
      .trim();
    return cleaned || '나는 오늘의 용기를 내일의 길로 바꾼다.';
  }

  window.openDreamModal = function openDreamModal() {
    var overlay = $('dreamModalOverlay');
    if (!overlay) return;

    // Always enter through the question input step, not the previous result state.
    if (typeof window.dreamReset === 'function') {
      window.dreamReset();
    }

    overlay.style.display = 'block';
    overlay.scrollTop = 0;
    setBodyLock(true);
    window.requestAnimationFrame(function () {
      overlay.classList.add('dream-ledger-overlay--show');
    });
    syncInputEnergy();
    setWizardLine('반갑습니다, 무의식의 여행자여. 마법책의 표지를 열고 오늘 밤의 장면을 적어주세요.');
    renderSpeedButtons();

    // On mobile, move viewport to the input area and open keyboard quickly.
    window.setTimeout(function () {
      var input = $('dreamInput');
      if (!input) return;
      try {
        input.focus({ preventScroll: false });
      } catch (_) {
        input.focus();
      }
      if (typeof input.scrollIntoView === 'function') {
        input.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 120);
  };

  window.closeDreamModal = function closeDreamModal() {
    stopTyping();
    var overlay = $('dreamModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('dream-ledger-overlay--show');
    window.setTimeout(function () {
      if (!overlay.classList.contains('dream-ledger-overlay--show')) {
        overlay.style.display = 'none';
      }
    }, 220);
    setBodyLock(false);
  };

  window.dreamReset = function dreamReset() {
    stopTyping();
    state.reading = null;
    $('dreamInput').value = '';
    $('dreamResultWrap').style.display = 'none';
    if ($('dreamArchivePanel')) $('dreamArchivePanel').style.display = 'none';
    $('dreamLoader').style.display = 'none';
    setLoaderText('수정구슬이 꿈의 파장을 수집 중입니다...');
    resetCards();
    renderKeywordChips([]);
    $('dreamStageTitle').textContent = '카드를 열어 숨겨진 문장을 확인하세요.';
    $('dreamStageText').textContent = '';
    $('dreamFinalSpell').textContent = '';
    var spellWrap = $('dreamFinalSpellWrap');
    if (spellWrap) spellWrap.style.display = 'none';
    setWizardLine('누가(무엇이) 어떤 행동을 했고, 당신의 감정이 어떻게 흔들렸는지 적어주세요.');
    updateStoryModeLabel();
    syncInputEnergy();
  };

  window.startDreamReading = function startDreamReading() {
    var input = $('dreamInput');
    var text = input ? input.value.trim() : '';
    if (input && typeof input.blur === 'function') input.blur();

    if (!text) {
      setLoaderText('누가(무엇이) 어떤 행동을 했고 어떤 감정을 느꼈는지 함께 적어주세요.');
      $('dreamLoader').style.display = 'block';
      setTimeout(function () {
        $('dreamLoader').style.display = 'none';
      }, 1300);
      return;
    }

    var ai = window.DreamLedgerAI;
    if (!ai || typeof ai.interpretDream !== 'function') return;

    resetCards();
    $('dreamResultWrap').style.display = 'none';
    $('dreamLoader').style.display = 'block';

    syncInputEnergy();
    setWizardLine('지팡이를 들어 꿈의 장면을 소환합니다. 카드가 차례대로 서사를 들려줄 거예요.');
    setLoaderText('수정구슬이 상징의 결을 읽는 중...');
    setTimeout(function () { setLoaderText('운명의 카드에 이름을 새기는 중...'); }, 700);

    setTimeout(function () {
      try {
        var reading = ai.interpretDream(text);
        hydrateReading(reading);
        var resultWrap = $('dreamResultWrap');
        if (resultWrap && typeof resultWrap.scrollIntoView === 'function') {
          window.setTimeout(function () {
            resultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 60);
        }
      } catch (err) {
        var msg = err && err.message ? err.message : '누가(무엇이) 어떤 행동을 했고, 어떤 감정을 느꼈는지 적어주세요.';
        setLoaderText(msg);
        setWizardLine('상징 공명이 흐려졌습니다. 입력을 다시 정돈해 주세요.');
        setTimeout(function () {
          $('dreamLoader').style.display = 'none';
        }, 1500);
      }
    }, 1450);
  };

  window.revealDreamStage = function revealDreamStage(stage) {
    var s = Number(stage);
    if (!state.reading || state.stageDone[s]) return;
    if (state.typingStage) return;
    if (s !== state.visibleStage) return;
    if (s !== state.nextStage) {
      setWizardLine('순서를 지켜주세요. 첫 카드부터 열면 서사가 온전히 이어집니다.');
      return;
    }

    var card = document.querySelector('.dream-ritual-card[data-dream-stage="' + s + '"]');
    var target = $('dreamStageText');
    var title = $('dreamStageTitle');
    if (!target) return;

    var payload = stagePayload(s);
    if (title) title.textContent = payload.title;
    if (card) {
      card.classList.add('is-flipping');
      card.classList.add('is-open');
      card.classList.remove('is-revealing');
      window.requestAnimationFrame(function () {
        card.classList.add('is-revealing');
      });
      setTimeout(function () {
        card.classList.remove('is-flipping');
        card.classList.remove('is-revealing');
      }, 800);
    }

    state.typingStage = s;
    typeText(target, payload.text, 17, function () {
      state.stageDone[s] = true;
      state.nextStage += 1;
      state.typingStage = 0;
      var nextBtn = $('dreamNextStageBtn');
      if (nextBtn) nextBtn.style.display = s < 3 ? 'block' : 'none';

      if (s === 3) {
        var spellText = '오늘의 행운 주문: ' + normalizedFinalSpell(state.reading);
        var spellWrap = $('dreamFinalSpellWrap');
        if (spellWrap) spellWrap.style.display = 'block';
        typeText($('dreamFinalSpell'), spellText, 14, function () {
          setWizardLine('좋아요. 마지막 장까지 읽었습니다. 오늘 밤은 자신을 다정하게 돌봐주세요.');
        });
      }
    });

    if (s === 1) setWizardLine('첫 장이 열렸습니다. 두 번째 카드에서 현재의 전언을 받아보세요.');
    if (s === 2) setWizardLine('서사가 무르익었습니다. 마지막 카드가 내일의 방향을 밝혀줍니다.');
  };

  window.nextDreamStage = function nextDreamStage() {
    if (state.typingStage) {
      setWizardLine('낭독이 끝난 뒤 다음 장으로 넘어갈 수 있어요.');
      return;
    }
    var current = state.visibleStage;
    if (!state.stageDone[current]) {
      setWizardLine('현재 카드의 문장을 먼저 열어주세요.');
      return;
    }
    if (current >= 3) return;

    var next = current + 1;
    updateVisibleStage(next);
    $('dreamStageTitle').textContent = next === 2 ? '2단계 카드를 눌러 전언을 여세요.' : '3단계 카드를 눌러 지침을 여세요.';
    $('dreamStageText').textContent = '';
    var nextBtn = $('dreamNextStageBtn');
    if (nextBtn) nextBtn.style.display = 'none';
    setWizardLine(next === 2 ? '제2장이 펼쳐졌습니다. 카드의 목소리를 들어보세요.' : '제3장이 열렸습니다. 마지막 장면이 기다립니다.');
  };

  window.dreamSetTextSpeed = function dreamSetTextSpeed(multiplier) {
    var value = Number(multiplier);
    if (!isFinite(value)) value = 1;
    value = Math.max(1, Math.min(2.5, value));
    state.textSpeed = value;
    renderSpeedButtons();
    setWizardLine('낭독 배속을 ' + speedLabel(value) + 'x로 조정했습니다.');
  };

  window.dreamOpenArchive = function dreamOpenArchive() {
    var panel = $('dreamArchivePanel');
    if (!panel) return;
    if (state.reading) {
      saveCurrentReadingToArchive();
      setWizardLine('현재 해몽을 꿈 저장소에 보관했습니다.');
    }
    renderArchiveList();
    panel.style.display = 'block';
    if (typeof panel.scrollIntoView === 'function') {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  window.dreamCloseArchive = function dreamCloseArchive() {
    var panel = $('dreamArchivePanel');
    if (!panel) return;
    panel.style.display = 'none';
  };

  window.dreamLoadArchiveAt = function dreamLoadArchiveAt(id) {
    var list = readArchive();
    var found = list.find(function (it) { return it.id === id; });
    if (!found || !found.reading) return;
    resetCards();
    hydrateReading(found.reading);
    setWizardLine('저장된 해몽을 다시 펼쳤습니다. 카드 순서대로 다시 확인해보세요.');
  };

  window.dreamDeleteArchiveAt = function dreamDeleteArchiveAt(id) {
    var list = readArchive().filter(function (it) { return it.id !== id; });
    writeArchive(list);
    renderArchiveList();
  };

  function buildShareText() {
    if (!state.reading) return '드림 타로 해몽 결과를 확인해보세요.';
    return [
      state.reading.title,
      state.reading.summary,
      '[숨겨진 근원] ' + state.reading.scene,
      '[현재의 전언] ' + state.reading.symbol,
      '[내일의 지침] ' + state.reading.echo,
      '행운 주문: ' + normalizedFinalSpell(state.reading)
    ].join('\n\n');
  }

  window.dreamShareCard = function dreamShareCard() {
    var shareText = buildShareText();

    if (navigator.share) {
      navigator.share({
        title: '무의식의 마법 상점: 드림 타로',
        text: shareText
      }).catch(function () {});
      return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareText).then(function () {
        alert('해몽 텍스트를 클립보드에 복사했습니다.');
      }).catch(function () {
        alert('공유를 지원하지 않는 환경입니다.');
      });
      return;
    }

    alert('공유를 지원하지 않는 환경입니다.');
  };

  document.addEventListener('input', function (event) {
    var target = event.target;
    if (target && target.id === 'dreamInput') syncInputEnergy();
  });

  renderSpeedButtons();
})();
