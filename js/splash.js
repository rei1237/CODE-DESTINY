(function(){
  var _splashDone = false;
  var SPLASH_MAX_MS = 5000;
  function diag(name, data) {
    try {
      if (window.__appDiag && typeof window.__appDiag.mark === 'function') {
        window.__appDiag.mark(name, data);
      }
    } catch (e) {}
  }
  console.log('[loader] App init start (splash bootstrap)');
  diag('splash.init.start');
  /* -- 기기 환경 판별 (모바일/데스크탑) -- */
  var isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* -- 별빛 캔버스 (데스크탑 전용: 모바일 RAF 부하 방지) -- */
  var cvs = document.getElementById('splashCanvas');
  var rafId;
  if (cvs && !isMobile) {
    try {
      var ctx = cvs.getContext('2d');
      if (!ctx) throw new Error('canvas-context-unavailable');
      cvs.width = window.innerWidth; cvs.height = window.innerHeight;
      /* 별 개수: 5개로 제한 */
      var stars = Array.from({length: 5}, function() {
        return {
          x: Math.random() * cvs.width,
          y: Math.random() * cvs.height,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.008 + 0.003
        };
      });
      function drawStars() {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        stars.forEach(function(s) {
          s.a += s.speed;
          var alpha = (Math.sin(s.a) * 0.5 + 0.5) * 0.8 + 0.1;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(200,210,255,' + alpha + ')';
          ctx.fill();
        });
        rafId = requestAnimationFrame(drawStars);
      }
      drawStars();
    } catch (e) {
      console.warn('[loader] splash canvas disabled:', e);
      diag('splash.canvas.disabled', { message: e && e.message ? e.message : 'unknown' });
      cvs.style.display = 'none';
    }
  } else if (cvs) {
    /* 모바일: 캔버스 비활성화 (compositor 레이어 부하 방지) */
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
      splash.style.pointerEvents = 'none';
      splash.style.display = 'none';
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }
    if (rafId) cancelAnimationFrame(rafId);
    console.log('[loader] Loading removed (splash hidden)');
    diag('splash.hidden');
  }

  if (document.readyState === 'complete') {
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash, { once: true });
    diag('splash.wait-load');
    /* 5초 강제 해제: 어떤 실패에서도 로더가 영구 고정되지 않게 보장 */
    setTimeout(function(){
      diag('splash.timeout.force-hide', { ms: SPLASH_MAX_MS });
      hideSplash();
    }, SPLASH_MAX_MS);
    /* 페이지 복귀 시 잔존 오버레이 제거 */
    window.addEventListener('pageshow', hideSplash, { once: true });
  }
})();
