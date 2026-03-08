;(function () {
  'use strict';

  var APP_ERR_BOX_ID = 'appStabilityFallback';
  var MAX_OVERLAY_MS = 18000;
  var overlayWatch = { startedAt: 0, active: false };

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
    hardHide(document.getElementById('codeSplash'), true);
    hardHide(document.getElementById('lib-overlay'), false);

    var loader = document.getElementById('sajuLoaderOverlay');
    if (loader) {
      hardHide(loader, false);
    }

    if (reason) {
      showFallback('콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
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
    window.addEventListener('error', function () {
      stopBlockingOverlays('global-error');
    });

    window.addEventListener('unhandledrejection', function () {
      stopBlockingOverlays('promise-rejection');
    });
  }

  function wrapCriticalFn(name) {
    var fn = window[name];
    if (typeof fn !== 'function' || fn.__wrappedSafe__) return;

    var wrapped = function () {
      try {
        return fn.apply(this, arguments);
      } catch (err) {
        try { console.error('[runtime-stability] ' + name + ' failed', err); } catch (e) {}
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

  function setDynamicVhVar() {
    var vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--app-vh', vh + 'px');
  }

  function init() {
    setDynamicVhVar();
    patchGlobalHandlers();
    patchCriticalFns();
    watchLoaderLifetime();

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
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
