(function () {
  var state = {
    reading: null,
    stageDone: { 1: false, 2: false, 3: false },
    nextStage: 1,
    visibleStage: 1
  };

  var bodyLockState = {
    locked: false,
    overflow: ''
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setBodyLock(locked) {
    if (locked) {
      if (bodyLockState.locked) return;
      bodyLockState.overflow = document.body.style.overflow || '';
      document.body.style.overflow = 'hidden';
      bodyLockState.locked = true;
      return;
    }

    if (!bodyLockState.locked) return;
    document.body.style.overflow = bodyLockState.overflow;
    bodyLockState.locked = false;
  }

  function resetCards() {
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
    });
    updateStageTabs(stage);
  }

  function setWizardLine(text) {
    var line = $('dreamWizardLine');
    if (line) line.textContent = text;
  }

  function typeText(targetEl, text, speed, done) {
    var i = 0;
    targetEl.textContent = '';
    var timer = setInterval(function () {
      i += 1;
      targetEl.textContent = text.slice(0, i);
      if (i >= text.length) {
        clearInterval(timer);
        if (typeof done === 'function') done();
      }
    }, speed || 24);
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
    setBodyLock(true);
    window.requestAnimationFrame(function () {
      overlay.classList.add('dream-ledger-overlay--show');
    });
    syncInputEnergy();
    setWizardLine('반갑습니다, 무의식의 여행자여.');

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
    var overlay = $('dreamModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('dream-ledger-overlay--show');
    overlay.style.display = 'none';
    setBodyLock(false);
  };

  window.dreamReset = function dreamReset() {
    state.reading = null;
    $('dreamInput').value = '';
    $('dreamResultWrap').style.display = 'none';
    $('dreamLoader').style.display = 'none';
    setLoaderText('수정구슬이 꿈의 파장을 수집 중입니다...');
    resetCards();
    renderKeywordChips([]);
    $('dreamStageTitle').textContent = '카드를 열어 숨겨진 문장을 확인하세요.';
    $('dreamStageText').textContent = '';
    $('dreamFinalSpell').textContent = '';
    setWizardLine('누가(무엇이) 어떤 행동을 했고, 당신이 어떤 감정을 느꼈는지 적어주세요.');
    syncInputEnergy();
  };

  window.startDreamReading = function startDreamReading() {
    var input = $('dreamInput');
    var text = input ? input.value.trim() : '';

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
    setWizardLine('지팡이를 들어, 당신의 꿈에서 가장 강한 상징을 부르겠습니다.');
    setLoaderText('수정구슬이 상징의 결을 읽는 중...');
    setTimeout(function () { setLoaderText('운명의 카드에 이름을 새기는 중...'); }, 700);

    setTimeout(function () {
      try {
        state.reading = ai.interpretDream(text);
        $('dreamCardTitle').textContent = state.reading.title;
        $('dreamCardSummary').textContent = state.reading.summary;
        renderKeywordChips(state.reading.keywords);
        renderCardFaces(state.reading);
        $('dreamStageTitle').textContent = '카드 1부터 순서대로 열어주세요.';
        $('dreamStageText').textContent = '';
        $('dreamFinalSpell').textContent = '';
        var nextBtn = $('dreamNextStageBtn');
        if (nextBtn) nextBtn.style.display = 'none';
        updateVisibleStage(1);
        setWizardLine('카드가 소환되었습니다. 과거-현재-미래의 순서로 천천히 열어주세요.');
        $('dreamLoader').style.display = 'none';
        $('dreamResultWrap').style.display = 'block';
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

    typeText(target, payload.text, 17, function () {
      var nextBtn = $('dreamNextStageBtn');
      if (!nextBtn) return;
      nextBtn.style.display = s < 3 ? 'block' : 'none';
    });
    state.stageDone[s] = true;
    state.nextStage += 1;

    if (s === 1) setWizardLine('안개 너머의 근원을 보셨군요. 이제 두 번째 카드를 열어 현재의 전언을 들으세요.');
    if (s === 2) setWizardLine('좋습니다. 마지막 카드가 내일의 운행 규칙을 알려줄 것입니다.');
    if (s === 3) {
      $('dreamFinalSpell').textContent = '오늘의 행운 주문: ' + normalizedFinalSpell(state.reading);
      setWizardLine('모든 해석은 치유를 향합니다. 꿈보다 해몽이다~');
    }
  };

  window.nextDreamStage = function nextDreamStage() {
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
    setWizardLine(next === 2 ? '두 번째 카드가 모습을 드러냈습니다.' : '마지막 카드가 기다리고 있습니다.');
  };

  window.dreamExportCard = function dreamExportCard() {
    var card = $('dreamResultCard');
    if (!card) return;

    if (typeof window.html2canvas !== 'function') {
      alert('저장 기능을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    window.html2canvas(card, {
      backgroundColor: '#060d19',
      scale: Math.min(window.devicePixelRatio || 1, 2),
      useCORS: true
    }).then(function (canvas) {
      var a = document.createElement('a');
      a.href = canvas.toDataURL('image/png');
      a.download = 'dream-ledger-card.png';
      a.click();
    });
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
})();
