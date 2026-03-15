(function(){
  var _splashDone = false;
  /* -- 기기 환경 판별 -- */
  var isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  /* prefers-reduced-motion: 접근성 배려 + 저사양 기기 보호 */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -- 별빛 캔버스 (데스크탑 전용, reduced-motion 비활성) -- */
  var cvs = document.getElementById('splashCanvas');
  var rafId, _frame = 0;
  if (cvs && !isMobile && !prefersReduced) {
    var ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;

    /* 색상 팔레트 (RGB 문자열 사전 생성 — 매 프레임 문자열 연산 없음) */
    var palette = ['200,215,255','225,235,255','255,245,210','220,200,255','255,255,255'];

    /* 별 40개 — 글로우 없음, 순수 alpha 트윙클 */
    var stars = Array.from({length: 40}, function() {
      var c = palette[Math.floor(Math.random() * palette.length)];
      return {
        x: Math.random() * cvs.width,
        y: Math.random() * cvs.height,
        r: Math.random() * 1.1 + 0.3,
        a: Math.random() * Math.PI * 2,
        spd: Math.random() * 0.008 + 0.003,
        base: Math.random() * 0.45 + 0.2,
        rng:  Math.random() * 0.3  + 0.1,
        col:  c   /* 'R,G,B' 문자열 — 한 번만 생성 */
      };
    });

    function drawStars() {
      _frame++;
      /* 2프레임에 1번 실제 렌더 → 효과적 30fps, CPU 절반 */
      if (_frame & 1) { rafId = requestAnimationFrame(drawStars); return; }

      ctx.clearRect(0, 0, cvs.width, cvs.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.a += s.spd;
        var alpha = s.base + Math.sin(s.a) * s.rng;
        if (alpha < 0.04) alpha = 0.04;
        if (alpha > 0.95) alpha = 0.95;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 6.2832);
        ctx.fillStyle = 'rgb(' + s.col + ')';
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(drawStars);
    }
    drawStars();
  } else if (cvs) {
    /* 모바일 / reduced-motion: 캔버스 비활성화 */
    cvs.style.display = 'none';
  }

  /* -- 안내 문구 순환 -- */
  var msgs = [
    '하늘의 별자리를 조용히 정렬하는 중...',
    '오행의 흐름을 부드럽게 맞추는 중...',
    '당신의 운명 좌표를 분석하는 중...',
    '타로 카드가 전할 이야기를 준비하는 중...',
    '오늘의 행운과 조언을 정리하는 중...',
    '잠시만요, 결과 화면을 곧 열어드릴게요...'
  ];
  var mi = 0;
  var msgEl = document.getElementById('splashMsg');
  var msgTimer = setInterval(function() {
    if (!msgEl) return;
    mi = (mi + 1) % msgs.length;
    msgEl.style.opacity = '0';
    msgEl.style.transition = 'opacity 0.35s';
    setTimeout(function() {
      if (msgEl) {
        msgEl.textContent = msgs[mi];
        msgEl.style.opacity = '1';
      }
    }, 350);
  }, 1800);

  /* -- 로딩 바 진행 -- */
  var bar = document.getElementById('splashBar');
  var barVal = 0;
  var barTimer = setInterval(function() {
    barVal = Math.min(barVal + Math.random() * 18 + 5, 90);
    if (bar) bar.style.width = barVal + '%';
    if (barVal >= 90) clearInterval(barTimer);
  }, 350);

  /* -- 초기 로딩 완료 -> 스플래시 숨김 -- */
  function hideSplash() {
    if (_splashDone) return;
    _splashDone = true;
    clearInterval(msgTimer);
    clearInterval(barTimer);
    if (bar) bar.style.width = '100%';
    var splash = document.getElementById('codeSplash');
    if (splash) {
      splash.style.display = 'none';
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }
    if (rafId) cancelAnimationFrame(rafId);
  }

  if (document.readyState === 'complete') {
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash, { once: true });
    /* 긴급 해제: 모바일은 5초, 데스크탑은 5초 후 강제 종료 */
    setTimeout(hideSplash, isMobile ? 5000 : 5000);
    /* 페이지 복귀 시 잔존 오버레이 제거 */
    window.addEventListener('pageshow', hideSplash, { once: true });
  }
})();
