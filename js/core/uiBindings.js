function callGlobal(fnName, ...args) {
  const fn = window[fnName];
  if (typeof fn === 'function') {
    return fn(...args);
  }
  return undefined;
}

function parseArgs(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function bindEventAction(root, eventName, attrName) {
  root.addEventListener(eventName, (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const actionEl = target.closest(`[${attrName}]`);
    if (!actionEl) return;

    const action = actionEl.getAttribute(attrName);
    if (!action) return;

    callGlobal(action, event);
  });
}

export function bindGlobalActions(root) {
  root.addEventListener('click', (event) => {
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;

    const action = actionEl.getAttribute('data-action');
    if (!action) return;

    if (actionEl.getAttribute('data-action-self-only') === '1' && event.target !== actionEl) {
      return;
    }

    if (actionEl.getAttribute('data-action-stop-propagation') === '1') {
      event.stopPropagation();
    }

    if (action === 'changeLanguage') {
      const lang = actionEl.getAttribute('data-lang');
      if (lang) {
        callGlobal('changeLanguage', lang, actionEl);
      }
      return;
    }

    const args = parseArgs(actionEl.getAttribute('data-action-args'));
    const passSelfMode = actionEl.getAttribute('data-action-pass-self');
    const passEvent = actionEl.getAttribute('data-action-pass-event') === '1';

    if (passSelfMode === 'append') {
      callGlobal(action, ...args, actionEl);
    } else if (passSelfMode === '1' || passSelfMode === 'prepend') {
      callGlobal(action, actionEl, ...args);
    } else if (passEvent) {
      callGlobal(action, event);
    } else if (args.length) {
      callGlobal(action, ...args);
    } else {
      callGlobal(action);
    }
  });

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const action = target.getAttribute('data-change-action');
    if (!action) return;
    const args = parseArgs(target.getAttribute('data-change-args'));
    callGlobal(action, ...args);
  });

  bindEventAction(root, 'mousedown', 'data-mousedown-action');
  bindEventAction(root, 'mouseup', 'data-mouseup-action');
  bindEventAction(root, 'mouseleave', 'data-mouseleave-action');
  bindEventAction(root, 'touchstart', 'data-touchstart-action');
  bindEventAction(root, 'touchend', 'data-touchend-action');
  bindEventAction(root, 'touchcancel', 'data-touchcancel-action');
}
