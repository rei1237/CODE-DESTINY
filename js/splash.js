(function(){
  var _splashDone = false;
  /* -- ��ġ ��� �Ǻ� (�����/�º���) -- */
  var isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  /* -- ���� ĵ���� (����ũž ���� -- ������� RAF ���� ����) -- */
  var cvs = document.getElementById('splashCanvas');
  var rafId;
  if (cvs && !isMobile) {
    var ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;
    /* �� ����: 5���� ���� */
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
  } else if (cvs) {
    /* �����: ĵ���� ���� (compositor ���̾� ����) */
    cvs.style.display = 'none';
  }

  /* -- �ȳ� ���� ��ȯ -- */
  var msgs = [
    '�ϴ��� ���ڸ��� ����� ���� ���ĵǴ� ��...',
    '�������� ���� ����� ���� �մ� ��...',
    '����� �������ڸ� �м��ϴ� ��...',
    'Ÿ�� ī�尡 ����� �̾߱⸦ ��ٸ��ϴ�...',
    '������ ����� ��� ��� ��ġ�� ��...',
    '������ �ӻ��̴� ������ ����� �ص� ��...'
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

  /* -- �ε� �� ���� -- */
  var bar = document.getElementById('splashBar');
  var barVal = 0;
  var barTimer = setInterval(function() {
    barVal = Math.min(barVal + Math.random() * 18 + 5, 90);
    if (bar) bar.style.width = barVal + '%';
    if (barVal >= 90) clearInterval(barTimer);
  }, 350);

  /* -- ������ �ε� �Ϸ� -> ���÷��� ���� -- */
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
    /* 긴급 해제: 모바일은 12초, 데스크탑은 8초 후 강제 종료 */
    setTimeout(hideSplash, isMobile ? 12000 : 8000);
    /* 페이지 복귀 시 잔존 오버레이 제거 */
    window.addEventListener('pageshow', hideSplash, { once: true });
  }
})();
