
;(function () {
  'use strict';

  var HIDDEN_CLS   = 'fate-scroll-section-hidden';
  var VISIBLE_CLS  = 'fate-scroll-section-visible';
  var INDICATOR_ID = 'fateScrollNextIndicator';
  /* resultPage 내 대상 선택자 (글로벌 태그 직접 스타일 금지) */
  var INNER_SEL = '.card, .destiny-section, .letter-box, .share-section';

  /* ── 유틸 ── */
  function getSections() {
    var rp = document.getElementById('resultPage');
    return rp ? Array.from(rp.querySelectorAll(INNER_SEL)) : [];
  }

  function isDisplayed(el) {
    return !!(el && el.offsetParent !== null &&
      getComputedStyle(el).display !== 'none');
  }

  /* ── 1. Reveal Observer (Intersection Observer) ── */
  var revealObserver = null;

  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target?.classList.remove(HIDDEN_CLS);
          entry.target?.classList.add(VISIBLE_CLS);
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.07
    });

    getSections().forEach(function (el) {
      if (!el.classList.contains(VISIBLE_CLS)) {
        el.classList.add(HIDDEN_CLS);
        revealObserver.observe(el);
      }
    });
  }

  /* ── 2. 다음 섹션 인디케이터 ── */
  var indicatorEl    = null;
  var indicatorLabel = null;
  var currentSection = null;
  var sectionObserver = null;

  function createIndicator() {
    if (document.getElementById(INDICATOR_ID)) {
      indicatorEl    = document.getElementById(INDICATOR_ID);
      indicatorLabel = document.getElementById('fateNextLabel');
      return;
    }
    indicatorEl = document.createElement('div');
    indicatorEl.className = 'fate-scroll-next-indicator';
    indicatorEl.id = INDICATOR_ID;
    indicatorEl.innerHTML =
      '<button class="fate-scroll-next-arrow" id="fateNextArrow" aria-label="다음 섹션으로 이동">&#8595;</button>' +
      '<span class="fate-scroll-next-label" id="fateNextLabel">다음 서비스 보기</span>';
    document.body?.appendChild(indicatorEl);
    indicatorLabel = document.getElementById('fateNextLabel');

    var arrowBtn = document.getElementById('fateNextArrow');
    arrowBtn?.addEventListener('click', function () {
      if (!currentSection) return;
      var all = getSections().filter(isDisplayed);
      var idx = all.indexOf(currentSection);
      var next = all[idx + 1] ?? null;
      next?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function initSectionTracker() {
    if (!('IntersectionObserver' in window)) return;
    sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        currentSection = entry.target;
        var all = getSections().filter(isDisplayed);
        var idx = all.indexOf(currentSection);
        var hasNext = idx !== -1 && idx < all.length - 1;
        if (!indicatorEl) return;
        if (hasNext) {
          var nextEl   = all[idx + 1];
          var titleEl  = nextEl?.querySelector('.sec-title, .destiny-title, h3, .fortune-sec-title');
          var titleTxt = (titleEl?.textContent ?? '').trim();
          if (!titleTxt) titleTxt = '다음 서비스 보기';
          if (indicatorLabel) {
            indicatorLabel.textContent = titleTxt.length > 16
              ? titleTxt.slice(0, 15) + '\u2026'
              : titleTxt;
          }
          indicatorEl.classList.add('fate-scroll-next-visible');
        } else {
          indicatorEl.classList.remove('fate-scroll-next-visible');
        }
      });
    }, {
      rootMargin: '-22% 0px -22% 0px',
      threshold: 0
    });

    getSections().filter(isDisplayed).forEach(function (el) {
      sectionObserver.observe(el);
    });
  }

  /* ── 3. 나중에 display:none → 표시되는 섹션 관찰 ── */
  function watchLateReveal() {
    var rp = document.getElementById('resultPage');
    if (!rp) return;
    var mo = new MutationObserver(function (mutations) {
      mutations.forEach(function (mut) {
        var el = mut.target;
        if (!isDisplayed(el)) return;
        /* display:none → block 전환된 섹션이면 reveal + tracker 추가 */
        if (el.matches && el.matches(INNER_SEL)) {
          if (!el.classList.contains(VISIBLE_CLS) && !el.classList.contains(HIDDEN_CLS)) {
            el.classList.add(HIDDEN_CLS);
          }
          revealObserver?.observe(el);
          sectionObserver?.observe(el);
        }
      });
    });
    getSections().forEach(function (el) {
      mo.observe(el, { attributes: true, attributeFilter: ['style', 'class'] });
    });
  }

  /* ── 4. 결과 페이지 활성화 감지 후 전체 초기화 ── */
  function onResultVisible() {
    createIndicator();
    /* DOM 렌더링 완전 반영 후 초기화 (requestAnimationFrame 2프레임) */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        /* reveal 의 transform 적용 전 스크롤 최상단 고정 (부드러운 스크롤로 대체) */
        initReveal();
        initSectionTracker();
        watchLateReveal();
      });
    });
  }

  function init() {
    var rp = document.getElementById('resultPage');
    if (!rp) return;
    /* 이미 표시 중인 경우 */
    if (rp.style.display !== 'none' && isDisplayed(rp)) {
      onResultVisible();
      return;
    }
    /* resultPage style 속성 변화 감지 */
    var rpMo = new MutationObserver(function () {
      var page = document.getElementById('resultPage');
      if (page && page.style.display !== 'none') {
        rpMo.disconnect();
        setTimeout(onResultVisible, 80);
      }
    });
    rpMo.observe(rp, { attributes: true, attributeFilter: ['style'] });
  }

  /* DOMContentLoaded or immediate */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
