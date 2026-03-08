;(function () {
  'use strict';

  var APP_ERR_BOX_ID = 'appStabilityFallback';
  var MAX_OVERLAY_MS = 8000;
  var INIT_FALLBACK_MS = 5000;
  var overlayWatch = { startedAt: 0, active: false };
  var _initDone = false;

  function now() { return Date.now(); }

  function showFallback(msg) {
    var text = msg || '콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.';
    var el = document.getElementById(APP_ERR_BOX_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = APP_ERR_BOX_ID;
      el.style.cssText = 'position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147483646;'
        + 'background:rgba(18,20,30,.94);color:#fff;border:1px solid rgba(255,255,255,.2);'
        + 'padding:10px 14px;border-radius:10px;font-size:12px;line-height:1.45;max-width:90vw;text-align:center;';
      document.body.appendChild(el);
    }
    el.textContent = text;
    setTimeout(function () {
      var cur = document.getElementById(APP_ERR_BOX_ID);
      if (cur && cur.parentNode) cur.parentNode.removeChild(cur);
    }, 7000);
  }

  function hardHide(el, removeNode) {
    if (!el) return;
    el.style.display = 'none';
    el.style.visibility = 'hidden';
    el.style.opacity = '0';
    el.classList.remove('show');
    el.classList.add('done');
    if (removeNode && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function stopBlockingOverlays(reason) {
    if (window._perf && typeof window._perf.unlockBody === 'function') {
      window._perf.unlockBody();
    }

    var splash = document.getElementById('codeSplash');
    if (splash) {
      splash.style.display = 'none';
      if (splash.parentNode) splash.parentNode.removeChild(splash);
    }

    var libOv = document.getElementById('lib-overlay');
    if (libOv) {
      libOv.style.display = 'none';
      if (libOv.parentNode) libOv.parentNode.removeChild(libOv);
    }

    var loader = document.getElementById('sajuLoaderOverlay');
    if (loader) {
      hardHide(loader, false);
    }

    if (reason) {
      showFallback('콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  }

  function hideLoadingScreen(reason) {
    stopBlockingOverlays(reason || 'hide-loading');
    try { console.log('loading removed'); } catch (e) {}
  }

  function ensureMainUiVisible() {
    var main = document.querySelector('main');
    if (main) {
      main.style.display = '';
      main.style.visibility = 'visible';
      main.style.opacity = '1';
    }
    var wrap = document.querySelector('.wrap');
    if (wrap) {
      wrap.style.visibility = 'visible';
      wrap.style.opacity = '1';
    }
    document.body.style.visibility = 'visible';
  }

  function watchLoaderLifetime() {
    var loader = document.getElementById('sajuLoaderOverlay');
    if (!loader) return;

    var checkTimer = setInterval(function () {
      var visible = loader.style.display !== 'none' && getComputedStyle(loader).display !== 'none';
      if (visible && !overlayWatch.active) {
        overlayWatch.active = true;
        overlayWatch.startedAt = now();
      }
      if (!visible && overlayWatch.active) {
        overlayWatch.active = false;
        overlayWatch.startedAt = 0;
      }
      if (overlayWatch.active && now() - overlayWatch.startedAt > MAX_OVERLAY_MS) {
        stopBlockingOverlays('loader-timeout');
        overlayWatch.active = false;
        overlayWatch.startedAt = 0;
      }
    }, 900);

    window.addEventListener('pagehide', function () {
      clearInterval(checkTimer);
    }, { once: true });
  }

  function patchGlobalHandlers() {
    window.addEventListener('error', function (e) {
      try {
        var src = e && e.target && e.target.src ? e.target.src : '';
        if (src) {
          console.error('[runtime-stability] script load error:', src);
        } else {
          console.error('[runtime-stability] global error:', e && e.message ? e.message : e);
        }
      } catch(ex) {}
      stopBlockingOverlays('global-error');
      ensureMainUiVisible();
    }, true);

    window.addEventListener('unhandledrejection', function (e) {
      try { console.error('[runtime-stability] unhandled rejection:', e.reason); } catch(ex) {}
      stopBlockingOverlays('promise-rejection');
      ensureMainUiVisible();
    });
  }

  function wrapCriticalFn(name) {
    var fn = window[name];
    if (typeof fn !== 'function' || fn.__wrappedSafe__) return;

    var wrapped = function () {
      try {
        var res = fn.apply(this, arguments);
        if (res && typeof res.then === 'function') {
          return res.catch(function (err) {
            try { console.error('[runtime-stability] async ' + name + ' failed', err); } catch (e) {}
            showFallback('콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return null;
          });
        }
        return res;
      } catch (err) {
        try { console.error('[runtime-stability] sync ' + name + ' failed', err); } catch (e) {}
        showFallback('콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return null;
      }
    };
    wrapped.__wrappedSafe__ = true;
    window[name] = wrapped;
  }

  function patchCriticalFns() {
    [
      'calculate',
      'startSajuCalculationFlow',
      'renderSummary',
      'renderZiwei',
      'renderAstroInsight',
      'renderSukuyo'
    ].forEach(wrapCriticalFn);
  }

  function runSafeTask(label, fn) {
    try {
      var out = fn();
      if (out && typeof out.then === 'function') {
        return out.catch(function (err) {
          try { console.error('[runtime-stability] task failed: ' + label, err); } catch (e) {}
          return null;
        });
      }
      return Promise.resolve(out);
    } catch (err) {
      try { console.error('[runtime-stability] task crashed: ' + label, err); } catch (e) {}
      return Promise.resolve(null);
    }
  }

  function loadCoreFeatures() {
    return Promise.all([
      runSafeTask('setDynamicVhVar', function () { setDynamicVhVar(); }),
      runSafeTask('patchGlobalHandlers', function () { patchGlobalHandlers(); }),
      runSafeTask('patchCriticalFns', function () { patchCriticalFns(); }),
      runSafeTask('watchLoaderLifetime', function () { watchLoaderLifetime(); }),
      runSafeTask('ensureMainUiVisible', function () { ensureMainUiVisible(); })
    ]);
  }

  function setDynamicVhVar() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--app-vh', vh + 'px');
  }

  async function initApp() {
    if (_initDone) return;
    _initDone = true;
    try { console.log('init start'); } catch (e) {}

    var hardTimeout = setTimeout(function () {
      hideLoadingScreen('init-fallback-timeout');
      ensureMainUiVisible();
    }, INIT_FALLBACK_MS);

    try {
      await loadCoreFeatures();
      try { console.log('core features loaded'); } catch (e) {}
    } catch (err) {
      try { console.error('[runtime-stability] initApp failed', err); } catch (e) {}
      showFallback('콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    } finally {
      clearTimeout(hardTimeout);
      hideLoadingScreen('init-finally');
      ensureMainUiVisible();
    }

    // Multi-phase cleanup to ensure stale overlays never survive.
    setTimeout(stopBlockingOverlays, 2500);
    setTimeout(stopBlockingOverlays, 7000);
    setTimeout(stopBlockingOverlays, 14000);

    window.addEventListener('resize', function () {
      setDynamicVhVar();
    }, { passive: true });

    window.addEventListener('orientationchange', function () {
      setTimeout(setDynamicVhVar, 80);
      setTimeout(stopBlockingOverlays, 1200);
    }, { passive: true });

    window.addEventListener('pageshow', function () {
      patchCriticalFns();
      setTimeout(stopBlockingOverlays, 250);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp, { once: true });
  } else {
    initApp();
  }
})();
