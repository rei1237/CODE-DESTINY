function syncFeatureCardHeight(card) {
  if (!card) return;
  var detail = card.querySelector('.feature-card__detail');
  var inner = card.querySelector('.feature-card__detail-inner');
  if (!detail || !inner) return;
  if (card.classList.contains('feature-card--open')) {
    detail.style.setProperty('--fc-open-height', (inner.scrollHeight + 4) + 'px');
  } else {
    detail.style.setProperty('--fc-open-height', '0px');
  }
}

window.addEventListener('resize', function() {
  document.querySelectorAll('.feature-card').forEach(syncFeatureCardHeight);
}, { passive: true });

function fcToggle(btn) {
  var card = btn.closest('.feature-card');
  function openByAction(actionName) {
    if (!card || !actionName) return false;
    var fn = window[actionName];
    if (typeof fn === 'function') {
      fn();
      return true;
    }
    var launch = card.querySelector('.feature-card__launch[data-action="' + actionName + '"]');
    if (launch && typeof launch.click === 'function') {
      launch.click();
      return true;
    }
    return false;
  }

  if (card) {
    if (card.classList.contains('feature-card--face') && openByAction('openPhysiognomyApp')) { return; }
    if (card.classList.contains('feature-card--animal') && openByAction('openMbtiModal')) { return; }
    if (card.classList.contains('feature-card--tarot') && openByAction('openTarotModal')) { return; }
    if (card.classList.contains('feature-card--tazza') && openByAction('openHwatuModal')) { return; }
    if (card.classList.contains('feature-card--egypt') && openByAction('openKemetModal')) { return; }
    if (card.classList.contains('feature-card--juyuk') && openByAction('openJuyukModal')) { return; }
    if (card.classList.contains('feature-card--sukuyo') && openByAction('openSukuyoModal')) { return; }
    if (card.classList.contains('feature-card--astro-fc') && openByAction('openAstroModal')) { return; }
    if (card.classList.contains('feature-card--ziwei') && openByAction('openZiweiModal')) { return; }
    if (card.classList.contains('feature-card--dream') && openByAction('openDreamModal')) { return; }
  }

  var open = card.classList.toggle('feature-card--open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  var detail = card.querySelector('.feature-card__detail');
  if (detail) detail.setAttribute('aria-hidden', open ? 'false' : 'true');
  syncFeatureCardHeight(card);
  btn.querySelector('.feature-card__cta-label').textContent = open ? '닫기' : btn.dataset.label;
  btn.querySelector('.feature-card__cta-arrow').textContent = open ? '▲' : '▼';
}

function bindFeatureCardVisualActions() {
  var defs = [
    { cardClass: 'feature-card--face', action: 'openPhysiognomyApp' },
    { cardClass: 'feature-card--animal', action: 'openMbtiModal' },
    { cardClass: 'feature-card--tarot', action: 'openTarotModal' },
    { cardClass: 'feature-card--tazza', action: 'openHwatuModal' },
    { cardClass: 'feature-card--egypt', action: 'openKemetModal' },
    { cardClass: 'feature-card--juyuk', action: 'openJuyukModal' },
    { cardClass: 'feature-card--sukuyo', action: 'openSukuyoModal' },
    { cardClass: 'feature-card--astro-fc', action: 'openAstroModal' },
    { cardClass: 'feature-card--ziwei', action: 'openZiweiModal' },
    { cardClass: 'feature-card--dream', action: 'openDreamModal' }
  ];

  defs.forEach(function(def) {
    var card = document.querySelector('.feature-card.' + def.cardClass);
    if (!card) return;
    ['.feature-card__img-wrap', '.feature-card__img', '.feature-card__title', '.feature-card__desc'].forEach(function(sel) {
      card.querySelectorAll(sel).forEach(function(el) {
        if (!el.getAttribute('data-action')) {
          el.setAttribute('data-action', def.action);
        }
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindFeatureCardVisualActions, { once: true });
} else {
  bindFeatureCardVisualActions();
}

function _dpStorage() {
  return window.DestinyProfileManager ? window.DestinyProfileManager.storage : null;
}
function _dpEsc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function _dpZodiac(y) {
  return ['🐀', '🐂', '🐅', '🐇', '🐉', '🐍', '🐎', '🐑', '🐒', '🐓', '🐕', '🐖'][(y - 4 + 120) % 12];
}

var _ModalProfileState = (function() {
  var _subs = {};

  function _syncGlobals(profile) {
    var b = profile.birth, l = profile.location || {};
    var corrH = b.hour != null ? b.hour : 12;
    var corrM = b.minute != null ? b.minute : 0;

    try {
      if (window.DestinyProfileManager && window.DestinyProfileManager.calcTrueSolarOffset) {
        var lng = l.lng != null ? l.lng : 127.0;
        var tz = l.tzOffset != null ? l.tzOffset : 9;
        var offMin = window.DestinyProfileManager.calcTrueSolarOffset(lng, tz);
        var total = ((corrH * 60 + corrM - offMin) % 1440 + 1440) % 1440;
        corrH = Math.floor(total / 60);
        corrM = total % 60;
      }
    } catch (e) {}

    window._ziweiBirth = {
      year: b.year,
      month: b.month,
      day: b.day,
      hour: corrH,
      minute: corrM,
      lat: l.lat != null ? l.lat : 37.6,
      lon: l.lng != null ? l.lng : 127.0,
      tz: l.tzOffset != null ? l.tzOffset : 9
    };

    if (typeof setGender === 'function') { try { setGender(profile.gender || 'F'); } catch (e2) {} }
    if (typeof GENDER !== 'undefined') { try { GENDER = profile.gender || 'F'; } catch (e3) {} }

    if (typeof window.computeProfileForModal === 'function') {
      try { window.computeProfileForModal(profile); } catch (e4) {
        console.warn('[ModalProfileState] computeProfileForModal 실패 — _ziweiBirth 직접 주입으로 대체:', e4);
      }
    }
  }

  return {
    subscribe: function(type, fn) { _subs[type] = fn; },
    unsubscribe: function(type) { delete _subs[type]; },
    dispatch: function(profile, targetType) {
      if (!profile || !profile.birth) return;
      _syncGlobals(profile);
      var types = targetType ? [targetType] : Object.keys(_subs);
      types.forEach(function(t) {
        if (_subs[t]) {
          try { _subs[t](profile); }
          catch (e) { console.error('[ModalProfileState] 렌더 오류 (' + t + '):', e); }
        }
      });
    }
  };
})();

function _renderSukuyoSection(profile) {
  var card = document.getElementById('sukuyoCard');
  var noP = document.getElementById('sukuyoNoProfile');
  var area = document.getElementById('sukuyoSection');
  var sheet = document.getElementById('sukuyoModalSheet');
  if (!area || !card) return;
  if (noP) noP.style.display = 'none';
  card.style.display = 'block';
  area.innerHTML = '<div style="text-align:center;padding:50px 20px;color:#a78bfa;font-family:\'Gowun Dodum\',serif;letter-spacing:1px;animation:syPulse 1.5s infinite;">✦ 운명의 별을 계산하는 중...</div>';
  if (sheet) sheet.scrollTop = 0;
  var b = profile.birth;
  var lunarObj = null;
  try {
    if (typeof KasiEngine !== 'undefined' && KasiEngine.solarToLunar)
      lunarObj = KasiEngine.solarToLunar(new Date(b.year, b.month - 1, b.day, b.hour || 12, b.minute || 0));
  } catch (e) { console.warn('[Sukuyo] lunarObj 계산 오류:', e); }
  setTimeout(function() {
    if (typeof renderSukuyo === 'function') renderSukuyo(null, null, null, lunarObj);
  }, 0);
}

function _renderZiweiSection(profile) {
  var card = document.getElementById('ziweiModalCard');
  var noP = document.getElementById('ziweiNoProfile');
  var area = document.getElementById('ziweiModalSection');
  var sheet = document.getElementById('ziweiModalSheet');
  if (!area || !card) return;
  if (noP) noP.style.display = 'none';
  card.style.display = 'block';
  area.innerHTML = '<div style="text-align:center;padding:50px 20px;color:#e879f9;font-family:\'Gowun Dodum\',serif;letter-spacing:1px;">✦ 자미두수 명반을 계산하는 중...</div>';
  if (sheet) sheet.scrollTop = 0;
  setTimeout(function() {
    if (typeof renderZiwei === 'function') {
      try { renderZiwei(null, null, 'ziweiModalSection'); }
      catch (e) { console.warn('[Ziwei] 렌더 오류:', e); }
    }
  }, 0);
}

function _renderAstroSection(profile) {
  var wrap = document.getElementById('astroCardWrap');
  var noP = document.getElementById('astroNoProfile');
  var area = document.getElementById('astroResult');
  var sheet = document.getElementById('astroModalSheet');
  if (!area || !wrap) return;
  if (noP) noP.style.display = 'none';
  wrap.style.display = 'block';
  area.innerHTML = '<div style="text-align:center;padding:50px 20px;color:#d1c4e9;font-family:\'Gowun Dodum\',serif;letter-spacing:1px;">✦ 코즈믹 차트를 계산하는 중...</div>';
  if (sheet) sheet.scrollTop = 0;
  setTimeout(function() {
    if (typeof renderAstroInsight === 'function') renderAstroInsight();
  }, 0);
}

var _dpSwitchPending = null;

function _dpShowSwitchConfirm(profile, onYes) {
  _dpSwitchPending = { profile: profile, onYes: onYes };
  var b = profile.birth || {}, l = profile.location || {};
  var cal = b.calType === 'solar' ? '양력' : (b.calType === 'lunar_leap' ? '음력(윤)' : '음력');
  var dateStr = cal + ' ' + b.year + '.'
    + String(b.month || 1).padStart(2, '0') + '.' + String(b.day || 1).padStart(2, '0')
    + ' · ' + String(b.hour != null ? b.hour : 12).padStart(2, '0')
    + ':' + String(b.minute != null ? b.minute : 0).padStart(2, '0');
  var iconEl = document.getElementById('dpSwIcon');
  var nameEl = document.getElementById('dpSwName');
  var detailEl = document.getElementById('dpSwDetail');
  var locEl = document.getElementById('dpSwLoc');
  if (iconEl) iconEl.textContent = _dpZodiac(b.year);
  if (nameEl) nameEl.textContent = profile.name || '';
  if (detailEl) detailEl.textContent = dateStr;
  if (locEl) locEl.textContent = l.label ? '📍 ' + l.label : '';
  var ov = document.getElementById('dpSwitchConfirmOverlay');
  if (!ov) return;
  ov.style.display = 'flex';
  ov.classList.remove('dp-switch-overlay--in');
  requestAnimationFrame(function() { ov.classList.add('dp-switch-overlay--in'); });
}

function dpSwitchConfirmYes() {
  var ov = document.getElementById('dpSwitchConfirmOverlay');
  if (ov) {
    ov.classList.remove('dp-switch-overlay--in');
    setTimeout(function() { ov.style.display = 'none'; }, 300);
  }
  if (_dpSwitchPending) {
    var cb = _dpSwitchPending.onYes, p = _dpSwitchPending.profile;
    _dpSwitchPending = null;
    try { cb(p); } catch (e) { console.error('[dpSwitchConfirm] 콜백 오류:', e); }
  }
}

function dpSwitchConfirmNo() {
  var ov = document.getElementById('dpSwitchConfirmOverlay');
  if (ov) {
    ov.classList.remove('dp-switch-overlay--in');
    setTimeout(function() { ov.style.display = 'none'; }, 300);
  }
  _dpSwitchPending = null;
}

function _dpSelect(id, type) {
  var s = _dpStorage(); if (!s) return;
  var list = s.list(), profile = null;
  for (var i = 0; i < list.length; i++) { if (list[i].id === id) { profile = list[i]; break; } }
  if (!profile) return;
  _dpShowSwitchConfirm(profile, function(p) {
    s.setCurrent(id);
    if (type === 'saju') {
      if (typeof window.dpRunWithProfile === 'function') window.dpRunWithProfile(id);
    } else {
      _ModalProfileState.dispatch(p, type);
    }
  });
}

function closeAllMysticModalsToHome() {
  if (typeof closeSukuyoModal === 'function') closeSukuyoModal();
  if (typeof closeZiweiModal === 'function') closeZiweiModal();
  if (typeof closeAstroModal === 'function') closeAstroModal();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function _dpPickerHTML(profiles, type, theme, backFn) {
  var h = '<div style="padding:16px 0 8px;">'
    + '<div style="text-align:center;margin-bottom:22px;padding:0 8px;">'
    + '<div style="font-size:2.5rem;margin-bottom:10px;">' + theme.icon + '</div>'
    + '<div style="font-family:\'Gowun Dodum\',serif;font-size:1rem;color:' + theme.ac + ';letter-spacing:2px;font-weight:700;margin-bottom:6px;">' + theme.title + '</div>'
    + '<div style="font-size:0.8rem;color:rgba(255,255,255,0.4);line-height:1.6;">' + (theme.sub || '운명 카드를 선택하면 바로 결과를 확인할 수 있습니다') + '</div>'
    + '</div><div style="display:flex;flex-direction:column;gap:10px;">';
  profiles.forEach(function(p) {
    var b = p.birth, l = p.location || {};
    var zodiac = _dpZodiac(b.year);
    var cal = b.calType === 'solar' ? '양력' : (b.calType === 'lunar_leap' ? '음력(윤)' : '음력');
    var gbadge = p.gender === 'M'
      ? '<span style="font-size:0.63rem;color:#93c5fd;background:rgba(96,165,250,0.15);border:1px solid rgba(96,165,250,0.3);padding:1px 6px;border-radius:10px;">♂</span>'
      : '<span style="font-size:0.63rem;color:#f9a8d4;background:rgba(244,114,182,0.15);border:1px solid rgba(244,114,182,0.3);padding:1px 6px;border-radius:10px;">♀</span>';
    h += '<div data-action="_dpSelect" data-action-args="' + p.id + ',' + type + '" '
      + 'style="display:flex;align-items:center;gap:13px;padding:13px 15px;cursor:pointer;'
      + 'background:rgba(255,255,255,0.03);border:1px solid rgba(' + theme.br + ',0.22);'
      + 'border-radius:14px;touch-action:manipulation;-webkit-tap-highlight-color:transparent;">'
      + '<div style="font-size:1.9rem;flex-shrink:0;">' + zodiac + '</div>'
      + '<div style="flex:1;min-width:0;">'
      + '<div style="font-family:\'Gowun Dodum\',serif;font-size:0.92rem;color:rgba(255,255,255,0.88);font-weight:700;margin-bottom:3px;">'
      + _dpEsc(p.name) + '&nbsp;' + gbadge + '</div>'
      + '<div style="font-size:0.76rem;color:rgba(255,255,255,0.45);">'
      + cal + '&nbsp;' + b.year + '.' + String(b.month).padStart(2, '0') + '.' + String(b.day).padStart(2, '0')
      + '&nbsp;&middot;&nbsp;' + String(b.hour != null ? b.hour : 12).padStart(2, '0') + ':' + String(b.minute != null ? b.minute : 0).padStart(2, '0') + '</div>'
      + (l.label ? '<div style="font-size:0.7rem;color:rgba(255,255,255,0.28);margin-top:2px;">📍&nbsp;' + _dpEsc(l.label) + '</div>' : '')
      + '</div>'
      + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="' + theme.ac + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;opacity:0.7;"><polyline points="9 18 15 12 9 6"/></svg>'
      + '</div>';
  });
  h += '</div>'
    + '<div style="text-align:center;margin-top:18px;">'
    + '<button data-action="' + (backFn || 'closeAllMysticModalsToHome') + '" '
    + 'style="background:transparent;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.4);'
    + 'padding:9px 18px;border-radius:10px;font-family:\'Gowun Dodum\',serif;font-size:0.8rem;cursor:pointer;touch-action:manipulation;">' + (backFn ? '← 닫기' : '← 홈으로') + '</button>'
    + '</div></div>';
  return h;
}

function _dpEmptyHTML(theme) {
  return '<div style="text-align:center;padding:60px 20px;">'
    + '<div style="font-size:3rem;margin-bottom:16px;">' + theme.icon + '</div>'
    + '<h3 style="color:' + theme.ac + ';margin-bottom:8px;font-family:\'Gowun Dodum\',serif;">나의 운명 카드 필요</h3>'
    + '<p style="color:#9ca3af;line-height:1.6;margin-bottom:24px;">' + theme.desc + '</p>'
    + '<button data-action="closeAllMysticModalsToHome" '
    + 'style="background:' + theme.bb + ';border:1px solid rgba(' + theme.br + ',0.5);color:' + theme.ac + ';'
    + 'padding:12px 24px;border-radius:12px;font-family:\'Gowun Dodum\',serif;font-size:0.9rem;cursor:pointer;touch-action:manipulation;">← 카드 설정하러 가기</button>'
    + '</div>';
}

function openSukuyoModal() {
  var overlay = document.getElementById('sukuyoModalOverlay');
  if (!overlay) return;
  var s = _dpStorage();
  var profiles = s ? s.list() : [];
  var profile = s ? s.current() : null;
  overlay.style.display = 'block';
  setTimeout(function() { overlay.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  var noProfile = document.getElementById('sukuyoNoProfile');
  var card = document.getElementById('sukuyoCard');
  var theme = { icon: '💫', ac: '#c4b5fd', br: '167,139,250', bb: 'linear-gradient(135deg,#1a0e3b,#2d1b6b)', title: '💫 宿曜占 · 숙요점', desc: '숙요점을 보려면 메인 화면에서<br>나의 운명 카드를 먼저 설정해주세요' };
  _ModalProfileState.subscribe('sukuyo', _renderSukuyoSection);
  if (!profile || !profile.birth) {
    if (card) card.style.display = 'none';
    if (noProfile) { noProfile.style.display = 'block'; noProfile.innerHTML = profiles.length > 0 ? _dpPickerHTML(profiles, 'sukuyo', theme) : _dpEmptyHTML(theme); }
    return;
  }
  _ModalProfileState.dispatch(profile, 'sukuyo');
}
function closeSukuyoModal() {
  var o = document.getElementById('sukuyoModalOverlay'); if (o) o.style.display = 'none';
  _ModalProfileState.unsubscribe('sukuyo');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openZiweiModal() {
  var overlay = document.getElementById('ziweiModalOverlay');
  if (!overlay) return;
  var s = _dpStorage();
  var profiles = s ? s.list() : [];
  var profile = s ? s.current() : null;
  overlay.style.display = 'block';
  setTimeout(function() { overlay.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  var noProfile = document.getElementById('ziweiNoProfile');
  var card = document.getElementById('ziweiModalCard');
  var theme = { icon: '🌌', ac: '#e879f9', br: '232,121,249', bb: 'linear-gradient(135deg,#2b0545,#4a0a7a)', title: '🌌 紫微斗數 · 자미두수', desc: '자미두수 명반을 보려면<br>메인 화면에서 나의 운명 카드를 먼저 설정해주세요' };
  _ModalProfileState.subscribe('ziwei', _renderZiweiSection);
  if (!profile || !profile.birth) {
    if (card) card.style.display = 'none';
    if (noProfile) { noProfile.style.display = 'block'; noProfile.innerHTML = profiles.length > 0 ? _dpPickerHTML(profiles, 'ziwei', theme) : _dpEmptyHTML(theme); }
    return;
  }
  _ModalProfileState.dispatch(profile, 'ziwei');
}
function closeZiweiModal() {
  var o = document.getElementById('ziweiModalOverlay'); if (o) o.style.display = 'none';
  _ModalProfileState.unsubscribe('ziwei');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openAstroModal() {
  var overlay = document.getElementById('astroModalOverlay');
  if (!overlay) return;
  var s = _dpStorage();
  var profiles = s ? s.list() : [];
  var profile = s ? s.current() : null;
  overlay.style.display = 'block';
  setTimeout(function() { overlay.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  var noProfile = document.getElementById('astroNoProfile');
  var cardWrap = document.getElementById('astroCardWrap');
  var theme = { icon: '✨', ac: '#d1c4e9', br: '125,42,232', bb: 'linear-gradient(135deg,#1e003b,#300063)', title: '✨ Cosmic Chart · 점성술', desc: '점성술 분석을 보려면 메인 화면에서<br>나의 운명 카드를 먼저 설정해주세요' };
  _ModalProfileState.subscribe('astro', _renderAstroSection);
  if (!profile || !profile.birth) {
    if (cardWrap) cardWrap.style.display = 'none';
    if (noProfile) { noProfile.style.display = 'block'; noProfile.innerHTML = profiles.length > 0 ? _dpPickerHTML(profiles, 'astro', theme) : _dpEmptyHTML(theme); }
    return;
  }
  _ModalProfileState.dispatch(profile, 'astro');
}
function closeAstroModal() {
  var o = document.getElementById('astroModalOverlay'); if (o) o.style.display = 'none';
  _ModalProfileState.unsubscribe('astro');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCurrentPage() {
  var overlayMap = [
    { id: 'juyukModalOverlay', closeFn: 'closeJuyukModal' },
    { id: 'sukuyoModalOverlay', closeFn: 'closeSukuyoModal' },
    { id: 'astroModalOverlay', closeFn: 'closeAstroModal' },
    { id: 'ziweiModalOverlay', closeFn: 'closeZiweiModal' }
  ];

  for (var i = 0; i < overlayMap.length; i++) {
    var item = overlayMap[i];
    var overlay = document.getElementById(item.id);
    if (!overlay) continue;
    if (overlay.style.display === 'none') continue;

    if (typeof window[item.closeFn] === 'function') {
      window[item.closeFn]();
    } else {
      overlay.style.display = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function _resetTarotUI() {
  document.getElementById('tarotResultContainer').style.display = 'none';
  document.getElementById('tarotCardEl').classList.remove('flipped');
  document.getElementById('tarotRitualMsg').innerText = '"당신의 간절한 고민을 선택해주세요..."';
  document.querySelectorAll('.oracle-cat-btn-m').forEach(function(btn) { btn.classList.remove('active'); });
  window.curTarotCat = null;
  window.isReading = false;
}
function openTarotModal() {
  var overlay = document.getElementById('tarotModalOverlay');
  overlay.style.display = 'block';
  if (window._perf && window._perf.lockBody) window._perf.lockBody();
  else document.body.style.overflow = 'hidden';
  var req = overlay.requestFullscreen || overlay.webkitRequestFullscreen || overlay.mozRequestFullScreen || overlay.msRequestFullscreen;
  if (req) {
    req.call(overlay).catch(function() {});
  }
}
function closeTarotModal() {
  var isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  if (isFs) {
    var exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
    if (exit) exit.call(document);
  } else {
    document.getElementById('tarotModalOverlay').style.display = 'none';
    if (window._perf && window._perf.unlockBody) window._perf.unlockBody();
    else document.body.style.overflow = '';
    _resetTarotUI();
  }
}
(function() {
  function onFsChange() {
    var isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    if (!isFs) {
      var overlay = document.getElementById('tarotModalOverlay');
      if (overlay && overlay.style.display !== 'none') {
        overlay.style.display = 'none';
        if (window._perf && window._perf.unlockBody) window._perf.unlockBody();
        else document.body.style.overflow = '';
        _resetTarotUI();
      }
    }
  }
  document.addEventListener('fullscreenchange', onFsChange);
  document.addEventListener('webkitfullscreenchange', onFsChange);
  document.addEventListener('mozfullscreenchange', onFsChange);
  document.addEventListener('MSFullscreenChange', onFsChange);
})();

function switchMysticTab(tabId, btnTarget) {
  if (typeof closeJuyukModal === 'function') closeJuyukModal();
  var container = btnTarget.closest('.mystic-tabs-wrapper');
  container.querySelectorAll('.mystic-tab-content').forEach(function(el) { el.classList.remove('active'); });
  container.querySelectorAll('.mystic-tab-btn').forEach(function(el) { el.classList.remove('active'); });

  document.getElementById(tabId).classList.add('active');
  btnTarget.classList.add('active');
}

function updateCompatUI() {
  var t = document.getElementById('compatType');
  var desc = document.getElementById('compatTypeDesc');
  var btn = document.getElementById('compatRunBtn');
  if (!t || !desc || !btn) return;
  var v = t.value || 'love';
  if (v === 'love') {
    desc.textContent = '연애/결혼: 감정, 온기, 일지·십성 간의 조화에 초점을 맞춘 분석을 제공합니다.';
    btn.innerHTML = '💗 연애 궁합 분석하기';
  } else if (v === 'business') {
    desc.textContent = '사업/동업: 역할·책임·용신·상극을 중심으로 실무적·재무적 적합성을 평가합니다.';
    btn.innerHTML = '💼 사업 궁합 분석하기';
  } else {
    desc.textContent = '친구/동료: 우정·협업·에너지 호흡을 중심으로 편안함과 시너지 포인트를 안내합니다.';
    btn.innerHTML = '🤝 우정/동료 궁합 분석하기';
  }
}
var compatTypeEl = document.getElementById('compatType');
if (compatTypeEl) compatTypeEl.addEventListener('change', updateCompatUI);
if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(updateCompatUI, 50);

function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'ko',
    includedLanguages: 'ko,en,ja,zh-CN,hi,es,fr',
    autoDisplay: false
  }, 'google_translate_element');
}

var _langCollapseTimer = null;
function toggleLangDropdown() {
  var wrap = document.getElementById('langWrap');
  wrap.classList.toggle('open');
  wrap.classList.remove('collapsed');
  resetLangCollapseTimer();
}
function closeLangDropdown() {
  var wrap = document.getElementById('langWrap');
  wrap.classList.remove('open');
}
function resetLangCollapseTimer() {
  clearTimeout(_langCollapseTimer);
  var wrap = document.getElementById('langWrap');
  wrap.classList.remove('collapsed');
  _langCollapseTimer = setTimeout(function() {
    if (!wrap.classList.contains('open')) {
      wrap.classList.add('collapsed');
    }
  }, 4000);
}
document.addEventListener('click', function(e) {
  var wrap = document.getElementById('langWrap');
  if (wrap && !wrap.contains(e.target)) {
    closeLangDropdown();
  }
});
document.addEventListener('DOMContentLoaded', function() {
  var wrap = document.getElementById('langWrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', function() {
      wrap.classList.remove('collapsed');
      clearTimeout(_langCollapseTimer);
    });
    wrap.addEventListener('mouseleave', function() {
      resetLangCollapseTimer();
    });
  }
  resetLangCollapseTimer();
});

var _langLabelMap = { 'ko': 'KR', 'en': 'EN', 'ja': 'JP', 'zh-CN': 'CN', 'hi': 'HI', 'es': 'ES', 'fr': 'FR' };

function changeLanguage(langCode, btn) {
  var btns = document.querySelectorAll('.lang-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  var label = document.getElementById('langLabel');
  if (label) label.textContent = _langLabelMap[langCode] || langCode.toUpperCase();

  closeLangDropdown();
  resetLangCollapseTimer();

  var selectField = document.querySelector('.goog-te-combo');
  if (selectField) {
    selectField.value = langCode;
    selectField.dispatchEvent(new Event('change'));
  } else {
    setTimeout(function() {
      var sel = document.querySelector('.goog-te-combo');
      if (sel) {
        sel.value = langCode;
        sel.dispatchEvent(new Event('change'));
      }
    }, 800);
  }

  if (langCode === 'ko') {
    var domain = window.location.hostname;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=' + domain + '; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.' + domain + '; path=/;';

    setTimeout(function() {
      window.location.reload();
    }, 100);
  }
}

window.addEventListener('load', function() {
  setTimeout(function() {
    var googCookie = document.cookie.match(/(^|;\s*)googtrans=([^;]*)/);
    var lang = 'ko';
    if (googCookie && googCookie[2]) {
      lang = googCookie[2].split('/').pop();
    }

    var btns = document.querySelectorAll('.lang-btn');
    btns.forEach(function(b) {
      b.classList.remove('active');
      if (b.getAttribute('data-lang') === lang) b.classList.add('active');
    });
    var label = document.getElementById('langLabel');
    if (label) label.textContent = _langLabelMap[lang] || 'KR';
  }, 1000);
});

(function() {
  var isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var modal = document.getElementById('ios-install-modal');
  if (modal) {
    var iosGuide = document.getElementById('ios-guide');
    var andGuide = document.getElementById('android-guide');
    if (isIos) {
      if (iosGuide) iosGuide.style.display = 'block';
    } else {
      if (andGuide) andGuide.style.display = 'block';
    }
  }
})();
