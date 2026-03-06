/* ═══════════════════════════════════════════
   Touch Performance Layer v2
   ═══════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── 1. 300ms 지연 완전 제거 ── */
  if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(){}, { passive: true });
  }

  /* ── 2. Throttle 유틸 (메인 스레드 과부하 방지) ── */
  function throttle(fn, ms) {
    var last = 0, tid;
    return function() {
      var now = Date.now(), rem = ms - (now - last);
      var ctx = this, args = arguments;
      clearTimeout(tid);
      if (rem <= 0) { last = now; fn.apply(ctx, args); }
      else { tid = setTimeout(function(){ last = Date.now(); fn.apply(ctx, args); }, rem); }
    };
  }

  /* ── 3. Debounce 유틸 ── */
  function debounce(fn, ms) {
    var tid;
    return function() {
      var ctx = this, args = arguments;
      clearTimeout(tid);
      tid = setTimeout(function(){ fn.apply(ctx, args); }, ms);
    };
  }

  /* ── 4. Resize 쓰로틀링 (200ms) + optimizedResize 커스텀 이벤트 ── */
  window.addEventListener('resize', throttle(function() {
    window.dispatchEvent(new CustomEvent('optimizedResize'));
  }, 200), { passive: true });

  /* ── 5. wheel / touchmove 전역 passive 선언 (스크롤 지터 제거) ── */
  ['wheel', 'touchmove'].forEach(function(type) {
    document.addEventListener(type, function(){}, { passive: true });
  });

  /* ── 6. touchstart → is-touching 즉각 시각 피드백 (0ms) ── */
  var TOUCH_SEL = 'button,.btn-main,.btn-sub,.tog-btn,.feature-card,' +
    '.dw-item,.ts-card,.celeb-tab-btn,.celeb-btn,.oracle-cat-btn-m,.ctg-btn';
  document.addEventListener('touchstart', function(e) {
    var el = e.target.closest(TOUCH_SEL);
    if (!el) return;
    el.classList.add('is-touching');
    function cleanup() {
      el.classList.remove('is-touching');
      el.removeEventListener('touchend', cleanup);
      el.removeEventListener('touchcancel', cleanup);
    }
    el.addEventListener('touchend', cleanup, { passive: true, once: true });
    el.addEventListener('touchcancel', cleanup, { passive: true, once: true });
    /* 햅틱 피드백 */
    if (navigator.vibrate) navigator.vibrate(8);
  }, { passive: true });

  /* ── 7. Lazy Loading — Intersection Observer ── */
  if ('IntersectionObserver' in window) {
    var lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    var imgObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
          imgObs.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });
    lazyImgs.forEach(function(img) { imgObs.observe(img); });
  }

  /* ── 8. 전역 이벤트 위임 — 이벤트 버블링 의도치 않은 중복 방지 ── */
  document.addEventListener('click', function(e) {
    /* 비활성화된 버튼 클릭 차단 */
    var btn = e.target.closest('button:disabled,[disabled]');
    if (btn) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  /* ── 전역 노출 (페이지 내 다른 코드에서 재사용) ── */
  window._perf = { throttle: throttle, debounce: debounce };

})();