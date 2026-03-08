const __perfCleanups = [];

function __addCleanup(fn) {
  if (typeof fn === 'function') __perfCleanups.push(fn);
}

function __isMobile() {
  return window.matchMedia('(max-width: 900px)').matches || /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

function __loadScriptOnce(src) {
  if (!src) return Promise.reject(new Error('missing src'));
  const existing = document.querySelector('script[data-dyn-src="' + src + '"]');
  if (existing && existing.dataset.loaded === '1') return Promise.resolve();
  if (existing && existing.dataset.loading === '1') {
    return new Promise((resolve, reject) => {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('load failed: ' + src)), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.defer = true;
    s.async = true;
    s.dataset.dynSrc = src;
    s.dataset.loading = '1';
    s.onload = () => {
      s.dataset.loading = '0';
      s.dataset.loaded = '1';
      resolve();
    };
    s.onerror = () => reject(new Error('load failed: ' + src));
    document.head.appendChild(s);
  });
}

function setupImageOptimization() {
  const imgs = document.querySelectorAll('img');
  if (!imgs.length) return;

  const styleId = 'mobileImgOptStyle';
  if (!document.getElementById(styleId)) {
    const st = document.createElement('style');
    st.id = styleId;
    st.textContent = '' +
      '.img-ph{background:linear-gradient(110deg,#f0f2f5 8%,#e7ebef 18%,#f0f2f5 33%);background-size:200% 100%;animation:imgPhShimmer 1.25s linear infinite;}' +
      'body.neo-mode .img-ph{background:linear-gradient(110deg,#1e2229 8%,#282e38 18%,#1e2229 33%);background-size:200% 100%;}' +
      '@keyframes imgPhShimmer{to{background-position-x:-200%;}}';
    document.head.appendChild(st);
  }

  imgs.forEach((img, idx) => {
    if (!img.getAttribute('loading')) img.setAttribute('loading', idx < 2 ? 'eager' : 'lazy');
    if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    if (!img.getAttribute('fetchpriority')) img.setAttribute('fetchpriority', idx < 2 ? 'high' : 'low');
    if (!img.classList.contains('img-ph') && !img.complete) img.classList.add('img-ph');
    img.addEventListener('load', () => img.classList.remove('img-ph'), { passive: true, once: true });
    img.addEventListener('error', () => img.classList.remove('img-ph'), { passive: true, once: true });
  });
}

function setupGpuSafety() {
  if (!__isMobile()) return;

  document.documentElement.classList.add('mobile-safe-render');

  const styleId = 'mobileSafeRenderStyle';
  if (!document.getElementById(styleId)) {
    const st = document.createElement('style');
    st.id = styleId;
    st.textContent = '' +
      '.mobile-safe-render .saju-book,.mobile-safe-render .saju-vortex,.mobile-safe-render .orb,.mobile-safe-render .feature-card,.mobile-safe-render .dw-item,.mobile-safe-render .ts-card,.mobile-safe-render .tarot-card,.mobile-safe-render .oracle-card-m{will-change:auto !important;}' +
      '.mobile-safe-render .feature-card:hover .feature-card__img{transform:none !important;}' +
      '.mobile-safe-render .tarot-focus-overlay,.mobile-safe-render .astral-modal-overlay{backdrop-filter:none !important;-webkit-backdrop-filter:none !important;}';
    document.head.appendChild(st);
  }
}

function setupTextCollapse() {
  const targets = document.querySelectorAll('.prem-text,.feature-card__detail-text,.res-text,.q-explanation,.compat-fact-body,.compat-advice-body');
  targets.forEach((el) => {
    if (!el || el.dataset.collapsedReady === '1') return;
    const txt = (el.textContent || '').trim();
    if (txt.length < 240) return;

    el.dataset.collapsedReady = '1';
    el.style.maxHeight = '6.2em';
    el.style.overflow = 'hidden';
    el.style.position = 'relative';

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-sub';
    btn.style.marginTop = '8px';
    btn.style.padding = '8px 12px';
    btn.style.fontSize = '0.82rem';
    btn.textContent = 'More';

    let open = false;
    btn.addEventListener('click', () => {
      open = !open;
      el.style.maxHeight = open ? 'none' : '6.2em';
      btn.textContent = open ? 'Less' : 'More';
    }, { passive: true });

    el.insertAdjacentElement('afterend', btn);
  });
}

function setupLazySectionHydration() {
  const heavyIds = [
    'compatCard',
    'skillTreeCard',
    'energyCoordCard',
    'healthReportCard',
    'lottoCard',
    'egyptCard',
    'hormone-vibe-section',
    'tTestCard',
    'shareSection',
    'emailSubBox'
  ];

  const cache = new Map();
  let io = null;

  function makeSkeleton(host) {
    const sk = document.createElement('div');
    sk.className = 'mobile-lazy-skeleton';
    sk.innerHTML = '<div class="skeleton skeleton-card"></div><div class="skeleton skeleton-card"></div>';
    host.innerHTML = '';
    host.appendChild(sk);
  }

  function sectionHost(section) {
    if (!section) return null;
    const host = section.querySelector(':scope > div[id], :scope > #compatResult, :scope > #skillTreeSection, :scope > #energyCoordSection, :scope > #healthReportSection, :scope > #lottoSection, :scope > #egyptSection, :scope > #hormoneVibeResult, :scope > #tTestResult');
    return host || null;
  }

  function prime(section) {
    if (!section || section.dataset.lazyPrimed === '1') return;
    const host = sectionHost(section);
    if (!host) return;

    const html = host.innerHTML;
    if (!html || html.trim().length < 80) return;

    cache.set(section.id, html);
    makeSkeleton(host);
    section.dataset.lazyPrimed = '1';
  }

  function hydrate(section) {
    if (!section) return;
    const html = cache.get(section.id);
    if (!html) return;

    const host = sectionHost(section);
    if (!host) return;

    host.innerHTML = html;
    cache.delete(section.id);
    section.dataset.lazyHydrated = '1';
  }

  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const section = entry.target;
      if (section.dataset.lazyPrimed === '1' && section.dataset.lazyHydrated !== '1') {
        hydrate(section);
      }
    });
  }, { root: null, rootMargin: '280px 0px', threshold: 0.01 });

  heavyIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section) return;
    io.observe(section);

    if (getComputedStyle(section).display !== 'none') {
      prime(section);
    }
  });

  const resultPage = document.getElementById('resultPage');
  if (resultPage) {
    const mo = new MutationObserver(() => {
      heavyIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        if (section.dataset.lazyPrimed === '1' || section.dataset.lazyHydrated === '1') return;
        if (getComputedStyle(section).display === 'none') return;
        prime(section);
      });
      setupTextCollapse();
      setupImageOptimization();
    });
    mo.observe(resultPage, { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class'] });
    __addCleanup(() => mo.disconnect());
  }

  __addCleanup(() => {
    if (io) io.disconnect();
    io = null;
    cache.clear();
  });
}

function setupFeatureCodeSplit() {
  const loaders = {
    physiognomy: () => __loadScriptOnce('AnalysisEngine.js').then(() => __loadScriptOnce('PhysiognomyUI.js')),
    mbti: () => __loadScriptOnce('js/astral-soul.js'),
    hwatu: () => __loadScriptOnce('HwatuFortune.js')
  };

  const state = { physiognomy: null, mbti: null, hwatu: null };

  function ensure(key) {
    if (!loaders[key]) return Promise.resolve();
    if (!state[key]) state[key] = loaders[key]();
    return state[key];
  }

  window.openPhysiognomyApp = async function openPhysiognomyAppProxy() {
    try { await ensure('physiognomy'); } catch (e) { console.error('[mobile-bootstrap] physiognomy load failed', e); }
    if (typeof window.openPhysiognomyApp === 'function' && window.openPhysiognomyApp !== openPhysiognomyAppProxy) {
      return window.openPhysiognomyApp.apply(window, arguments);
    }
    return null;
  };

  window.openMbtiModal = async function openMbtiModalProxy() {
    try { await ensure('mbti'); } catch (e) { console.error('[mobile-bootstrap] mbti load failed', e); }
    if (typeof window.openMbtiModal === 'function' && window.openMbtiModal !== openMbtiModalProxy) {
      return window.openMbtiModal.apply(window, arguments);
    }
    return null;
  };

  window.openHwatuModal = async function openHwatuModalProxy() {
    try { await ensure('hwatu'); } catch (e) { console.error('[mobile-bootstrap] hwatu load failed', e); }
    if (typeof window.openHwatuModal === 'function' && window.openHwatuModal !== openHwatuModalProxy) {
      return window.openHwatuModal.apply(window, arguments);
    }
    return null;
  };

  const idle = window.requestIdleCallback || function(cb) { return setTimeout(cb, 1200); };
  idle(() => {
    ensure('physiognomy').catch(() => {});
  });
}

function setupCoreCodeSplitHooks() {
  const wrap = (name, handler) => {
    const fn = window[name];
    if (typeof fn !== 'function' || fn.__mobileWrapped) return;
    const wrapped = handler(fn);
    wrapped.__mobileWrapped = true;
    window[name] = wrapped;
  };

  wrap('calculate', (original) => async function mobileWrappedCalculate() {
    let sajuChunk = null;
    try {
      sajuChunk = await import('./chunks/saju-analysis.chunk.js');
      if (sajuChunk && typeof sajuChunk.beforeCoreCalculate === 'function') {
        sajuChunk.beforeCoreCalculate();
      }
    } catch (e) {
      console.error('[mobile-bootstrap] saju-analysis chunk load failed', e);
    }
    try {
      const out = await original.apply(this, arguments);
      try {
        const extraChunk = await import('./chunks/extra-fortune.chunk.js');
        if (extraChunk && typeof extraChunk.bindExtraFortuneLazy === 'function') {
          extraChunk.bindExtraFortuneLazy();
        }
      } catch (e) {
        console.error('[mobile-bootstrap] extra-fortune chunk load failed', e);
      }
      return out;
    } finally {
      if (sajuChunk && typeof sajuChunk.afterCoreCalculate === 'function') {
        sajuChunk.afterCoreCalculate();
      }
      setupLazySectionHydration();
      setupTextCollapse();
      setupImageOptimization();
    }
  });

  wrap('runCompat', (original) => async function mobileWrappedRunCompat() {
    let compatChunk = null;
    try {
      compatChunk = await import('./chunks/compat.chunk.js');
      if (compatChunk && typeof compatChunk.beforeCompatRender === 'function') {
        compatChunk.beforeCompatRender();
      }
    } catch (e) {
      console.error('[mobile-bootstrap] compat chunk load failed', e);
    }
    const out = await original.apply(this, arguments);
    if (compatChunk && typeof compatChunk.afterCompatRender === 'function') {
      compatChunk.afterCompatRender();
    }
    return out;
  });
}

function init() {
  setupGpuSafety();
  setupImageOptimization();
  setupTextCollapse();
  setupFeatureCodeSplit();
  setupCoreCodeSplitHooks();
  setupLazySectionHydration();

  window.addEventListener('pagehide', () => {
    __perfCleanups.splice(0).forEach((fn) => {
      try { fn(); } catch (e) {}
    });
  }, { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init, { once: true });
} else {
  init();
}
