(function () {
  'use strict';

  var TAP_MOVE_THRESHOLD = 12;
  var GHOST_CLICK_BLOCK_MS = 420;
  var suppressClickUntil = 0;

  function isNaturallyInteractive(el) {
    if (!el || !el.tagName) return false;
    return /^(BUTTON|A|INPUT|SELECT|TEXTAREA|SUMMARY)$/.test(el.tagName);
  }

  function addA11yButtonAttrs(el) {
    if (!el || !(el instanceof HTMLElement)) return;
    el.classList.add('ios-tap-target');
    if (isNaturallyInteractive(el)) return;
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  }

  function getPoint(event) {
    if (!event) return null;
    var t = null;
    if (event.changedTouches && event.changedTouches.length) {
      t = event.changedTouches[0];
    } else if (event.touches && event.touches.length) {
      t = event.touches[0];
    }
    if (t) return { x: t.clientX, y: t.clientY };
    if (typeof event.clientX === 'number' && typeof event.clientY === 'number') {
      return { x: event.clientX, y: event.clientY };
    }
    return null;
  }

  function describeNode(el) {
    if (!el || !el.tagName) return '(null)';
    var id = el.id ? ('#' + el.id) : '';
    var cls = '';
    if (el.classList && el.classList.length) {
      cls = '.' + Array.from(el.classList).slice(0, 4).join('.');
    }
    return el.tagName.toLowerCase() + id + cls;
  }

  function logTapDebug(event, actionName, triggerEl) {
    try {
      var pt = getPoint(event) || { x: null, y: null };
      console.groupCollapsed('[tap-debug] ' + actionName + ' @ ' + describeNode(triggerEl));
      console.log('target:', event && event.target);
      console.log('currentTarget:', triggerEl);
      console.log('point:', pt);

      var node = triggerEl;
      var depth = 0;
      while (node && depth < 10) {
        var st = window.getComputedStyle(node);
        console.log(
          'tree[' + depth + ']:',
          describeNode(node),
          'z-index=' + st.zIndex,
          'pointer-events=' + st.pointerEvents,
          'position=' + st.position
        );
        node = node.parentElement;
        depth += 1;
      }

      if (pt.x !== null && pt.y !== null && typeof document.elementsFromPoint === 'function') {
        var stack = document.elementsFromPoint(pt.x, pt.y).slice(0, 8);
        console.log('elementsFromPoint:', stack.map(describeNode));
      }
      console.groupEnd();
    } catch (e) {
      console.warn('[tap-debug] log failed', e);
    }
  }

  function findActionTarget(originEl, actionName) {
    if (!originEl || typeof originEl.closest !== 'function') return null;
    var direct = originEl.closest('[data-action="' + actionName + '"]');
    if (direct) return direct;

    var card = originEl.closest('.feature-card');
    if (!card || typeof card.querySelector !== 'function') return null;
    return card.querySelector('[data-action="' + actionName + '"]');
  }

  function callAction(actionName, originEl) {
    var fn = window[actionName];
    if (typeof fn === 'function') {
      fn();
      return true;
    }

    var fallbackTarget = findActionTarget(originEl, actionName);
    if (fallbackTarget && typeof fallbackTarget.click === 'function') {
      fallbackTarget.click();
      return true;
    }

    return false;
  }

  function bindHybridTap(el, actionName) {
    if (!el || el.dataset.hybridTapBound === '1') return;
    el.dataset.hybridTapBound = '1';
    addA11yButtonAttrs(el);

    var touchStart = { x: 0, y: 0, valid: false };

    el.addEventListener('touchstart', function (event) {
      var pt = getPoint(event);
      if (!pt) {
        touchStart.valid = false;
        return;
      }
      touchStart.x = pt.x;
      touchStart.y = pt.y;
      touchStart.valid = true;
    }, { passive: true });

    el.addEventListener('touchend', function (event) {
      var pt = getPoint(event);
      if (!touchStart.valid || !pt) return;

      var dx = Math.abs(pt.x - touchStart.x);
      var dy = Math.abs(pt.y - touchStart.y);
      touchStart.valid = false;

      if (dx > TAP_MOVE_THRESHOLD || dy > TAP_MOVE_THRESHOLD) {
        return;
      }

      logTapDebug(event, actionName + ':touchend', el);
      var handled = callAction(actionName, el);
      if (!handled) return;

      event.preventDefault();
      event.stopPropagation();
      suppressClickUntil = Date.now() + GHOST_CLICK_BLOCK_MS;
    }, { passive: false });

    el.addEventListener('click', function (event) {
      if (Date.now() < suppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      logTapDebug(event, actionName + ':click', el);
      var handled = callAction(actionName, el);
      if (!handled) return;

      event.preventDefault();
      event.stopPropagation();
    }, true);

    el.addEventListener('keydown', function (event) {
      var key = event.key || '';
      if (key !== 'Enter' && key !== ' ') return;
      logTapDebug(event, actionName + ':keyboard', el);
      var handled = callAction(actionName, el);
      if (!handled) return;

      event.preventDefault();
      event.stopPropagation();
    });
  }

  function bindAll() {
    var bindingTable = [
      {
        action: 'openPhysiognomyApp',
        selector: [
          '[data-action="openPhysiognomyApp"]',
          '.feature-card--face .feature-card__cta',
          '.feature-card--face .feature-card__img-wrap',
          '.feature-card--face .feature-card__img',
          '.feature-card--face .feature-card__title',
          '.feature-card--face .feature-card__desc'
        ].join(',')
      },
      {
        action: 'openHwatuModal',
        selector: [
          '[data-action="openHwatuModal"]',
          '.feature-card--tazza .feature-card__cta',
          '.feature-card--tazza .feature-card__img-wrap',
          '.feature-card--tazza .feature-card__img',
          '.feature-card--tazza .feature-card__title',
          '.feature-card--tazza .feature-card__desc'
        ].join(',')
      }
    ];

    bindingTable.forEach(function (row) {
      var nodes = document.querySelectorAll(row.selector);
      nodes.forEach(function (el) {
        bindHybridTap(el, row.action);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindAll, { once: true });
  } else {
    bindAll();
  }
})();
