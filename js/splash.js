(function(){
  /* ── 안내 문구 순환 ── */
  var msgs = [
    '하늘의 별자리가 당신을 향해 정렬되는 중...',
    '우주와 운명의 실을 잇는 중...',
    '당신의 사주팔자 이야기가 기다립니다...',
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
      if(msgEl){
        msgEl.textContent = msgs[mi];
        msgEl.style.opacity = '1';
      }
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
        setTimeout(function(){ splash.remove(); }, 750);
      }
    }, 400);
  }

  if(document.readyState === 'complete'){
    hideSplash();
  } else {
    window.addEventListener('load', hideSplash);
    /* 안전장치: 네트워크 지연 등에도 3초 후 무조건 해제 (프리징 방지) */
    setTimeout(hideSplash, 3000);
  }
})();