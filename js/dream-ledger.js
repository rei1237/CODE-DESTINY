(function () {
  var state = {
    reading: null,
    stageDone: { 1: false, 2: false, 3: false }
  };

  function $(id) {
    return document.getElementById(id);
  }

  function setBodyLock(locked) {
    if (window._perf && typeof window._perf.lockBody === 'function' && typeof window._perf.unlockBody === 'function') {
      if (locked) window._perf.lockBody();
      else window._perf.unlockBody();
      return;
    }
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  function resetBlocks() {
    var blocks = document.querySelectorAll('.dream-block');
    blocks.forEach(function (block) {
      block.classList.remove('dream-block--open');
      var text = block.querySelector('.dream-block-text');
      if (text) text.textContent = '';
      var fog = block.querySelector('.dream-fog');
      if (fog) fog.style.display = '';
    });
    state.stageDone = { 1: false, 2: false, 3: false };
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

  window.openDreamModal = function openDreamModal() {
    var overlay = $('dreamModalOverlay');
    if (!overlay) return;
    overlay.style.display = 'block';
    setBodyLock(true);
    window.requestAnimationFrame(function () {
      overlay.classList.add('dream-ledger-overlay--show');
    });
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
    setLoaderText('별자리 기록실에서 꿈의 파장을 수집 중...');
    resetBlocks();
  };

  window.startDreamReading = function startDreamReading() {
    var input = $('dreamInput');
    var text = input ? input.value.trim() : '';

    if (!text) {
      setLoaderText('한 줄만 적어도 해몽이 열립니다. 꿈을 입력해주세요.');
      $('dreamLoader').style.display = 'block';
      setTimeout(function () {
        $('dreamLoader').style.display = 'none';
      }, 1300);
      return;
    }

    var ai = window.DreamLedgerAI;
    if (!ai || typeof ai.interpretDream !== 'function') return;

    resetBlocks();
    $('dreamResultWrap').style.display = 'none';
    $('dreamLoader').style.display = 'block';

    setLoaderText('상징 맥락을 정렬하는 중...');
    setTimeout(function () { setLoaderText('감정 파장을 분석하는 중...'); }, 650);

    setTimeout(function () {
      state.reading = ai.interpretDream(text);
      $('dreamCardTitle').textContent = state.reading.title;
      $('dreamCardSummary').textContent = state.reading.summary;

      $('dreamLoader').style.display = 'none';
      $('dreamResultWrap').style.display = 'block';
    }, 1450);
  };

  window.revealDreamStage = function revealDreamStage(stage) {
    var s = Number(stage);
    if (!state.reading || state.stageDone[s]) return;

    var block = document.querySelector('.dream-block[data-dream-stage="' + s + '"]');
    if (!block) return;

    var fog = block.querySelector('.dream-fog');
    var target = block.querySelector('.dream-block-text');
    if (!target) return;

    var content = '';
    if (s === 1) content = state.reading.scene;
    if (s === 2) content = state.reading.symbol;
    if (s === 3) content = state.reading.echo;

    block.classList.add('dream-block--open');
    if (fog) fog.style.display = 'none';
    typeText(target, content, 20);
    state.stageDone[s] = true;
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
    if (!state.reading) return 'Dream Ledger 해몽 결과를 확인해보세요.';
    return [
      state.reading.title,
      state.reading.summary,
      '[꿈의 풍경] ' + state.reading.scene,
      '[운명의 상징] ' + state.reading.symbol,
      '[현실로의 메아리] ' + state.reading.echo
    ].join('\n\n');
  }

  window.dreamShareCard = function dreamShareCard() {
    var shareText = buildShareText();

    if (navigator.share) {
      navigator.share({
        title: 'Dream Ledger',
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
})();
