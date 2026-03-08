;(function () {
  'use strict';

  var SCRIPT_TIMEOUT_MS = 8000;
  var loadingMap = Object.create(null);
  var proxyMap = Object.create(null);

  var FEATURE_SOURCES = {
    openPhysiognomyApp: ['AnalysisEngine.js', 'PhysiognomyUI.js'],
    openMbtiModal: ['js/astral-soul.js'],
    openHwatuModal: ['HwatuFortune.js']
  };

  function log(name, data) {
    try {
      if (window.__appDiag && typeof window.__appDiag.mark === 'function') {
        window.__appDiag.mark(name, data || null);
      }
    } catch (e) {}
  }

  function showSoftError(message) {
    var text = message || '콘텐츠를 불러오는 중입니다. 잠시 후 다시 시도해주세요.';
    try {
      if (window._showEngineFallbackNotice && typeof window._showEngineFallbackNotice === 'function') {
        window._showEngineFallbackNotice(text);
        return;
      }
    } catch (e) {}
    try { alert(text); } catch (e) {}
  }

  function loadScriptOnce(src) {
    if (!src) return Promise.reject(new Error('missing-src'));

    if (loadingMap[src]) return loadingMap[src];

    var existing = document.querySelector('script[data-core-lazy-src="' + src + '"]');
    if (existing && existing.dataset.loaded === '1') {
      loadingMap[src] = Promise.resolve();
      return loadingMap[src];
    }

    loadingMap[src] = new Promise(function (resolve, reject) {
      var done = false;
      var s = existing || document.createElement('script');

      function finishOk() {
        if (done) return;
        done = true;
        clearTimeout(tid);
        s.dataset.loaded = '1';
        log('feature.lazy.loaded', { src: src });
        resolve();
      }

      function finishErr(err) {
        if (done) return;
        done = true;
        clearTimeout(tid);
        try { delete loadingMap[src]; } catch (e) {}
        log('feature.lazy.failed', { src: src, message: err && err.message ? err.message : 'unknown' });
        reject(err || new Error('script-load-failed'));
      }

      var tid = setTimeout(function () {
        finishErr(new Error('script-load-timeout:' + src));
      }, SCRIPT_TIMEOUT_MS);

      if (!existing) {
        s.src = src;
        s.async = true;
        s.defer = true;
        s.dataset.coreLazySrc = src;
        document.head.appendChild(s);
      }

      s.addEventListener('load', finishOk, { once: true });
      s.addEventListener('error', function () {
        finishErr(new Error('script-load-error:' + src));
      }, { once: true });

      if (existing && existing.dataset.loaded === '1') finishOk();
    });

    return loadingMap[src];
  }

  function ensureFeature(fnName) {
    var srcs = FEATURE_SOURCES[fnName] || [];
    var chain = Promise.resolve();
    srcs.forEach(function (src) {
      chain = chain.then(function () { return loadScriptOnce(src); });
    });
    return chain;
  }

  function installProxy(fnName) {
    var proxy = async function () {
      log('feature.lazy.invoke', { fn: fnName });
      try {
        await ensureFeature(fnName);
      } catch (err) {
        console.error('[feature-lazy] failed to load', fnName, err);
        showSoftError('기능 로딩이 지연되고 있습니다. 네트워크 상태를 확인하고 다시 시도해주세요.');
        return null;
      }

      var realFn = window[fnName];
      if (typeof realFn === 'function' && realFn !== proxyMap[fnName]) {
        return realFn.apply(window, arguments);
      }

      showSoftError('기능 초기화가 완료되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return null;
    };

    proxyMap[fnName] = proxy;
    window[fnName] = proxy;
  }

  Object.keys(FEATURE_SOURCES).forEach(installProxy);
})();
