(function(){
  /* ── 별빛 캔버스 ── */
  var cvs = document.getElementById('splashCanvas');
  if(cvs){
    var ctx = cvs.getContext('2d');
    cvs.width = window.innerWidth; cvs.height = window.innerHeight;
    var stars = Array.from({length:120}, function(){
      return {
        x: Math.random()*cvs.width,
        y: Math.random()*cvs.height,
        r: Math.random()*1.5+0.3,
        a: Math.random(),
        speed: Math.random()*0.008+0.003
      };
    });
    var rafId;
    function drawStars(){
      ctx.clearRect(0,0,cvs.width,cvs.height);
      stars.forEach(function(s){
        s.a += s.speed;
        var alpha = (Math.sin(s.a)*0.5+0.5)*0.8+0.1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(200,210,255,'+alpha+')';
        ctx.fill();
      });
      rafId = requestAnimationFrame(drawStars);
    }
    drawStars();
  }

  /* ── 안내 문구 순환 ── */
  var msgs = [
    '하늘의 별자리가 당신을 향해 정렬되는 중...',
    '만세력을 펼쳐 운명의 실을 잇는 중...',
    '당신의 사주팔자를 분석하는 중...',
    '타로 카드가 당신의 이야기를 기다립니다...',
    '우주의 기운을 모아 운세를 점치는 중...',
    '별들이 속삭이는 오늘의 운명을 해독 중...'
  ];
  var mi = 0;
  var msgEl = document.getElementById('splashMsg');
  var msgTimer = setInterval(function(){
    if(!msgEl) return;
    mi = (mi + 1) % msgs.length;
    msgEl.style.opacity = '0';
    msgEl.style.transition = 'opacity 0.35s';
    setTimeout(function(){
      msgEl.textContent = msgs[mi];
      msgEl.style.opacity = '1';
    }, 350);
  }, 1800);

  /* ── 로딩 바 진행 ── */
  var bar = document.getElementById('splashBar');
  var barVal = 0;
  var barTimer = setInterval(function(){
    barVal = Math.min(barVal + Math.random()*18 + 5, 90);
    if(bar) bar.style.width = barVal + '%';
    if(barVal >= 90) clearInterval(barTimer);
  }, 350);

  /* ── 페이지 로드 완료 → 스플래시 제거 ── */
  function hideSplash(){
    clearInterval(msgTimer);
    clearInterval(barTimer);
    if(bar) bar.style.width = '100%';
    setTimeout(function(){
      var splash = document.getElementById('codeSplash');
      if(splash){
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
        setTimeout(function(){ splash.remove(); if(rafId) cancelAnimationFrame(rafId); }, 750);
      }
    }, 400);
  }

  if(document.readyState === 'complete'){
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash);
    /* 네트워크가 느릴 경우도 최대 6초 후 강제 제거 */
    setTimeout(hideSplash, 6000);
  }
})();