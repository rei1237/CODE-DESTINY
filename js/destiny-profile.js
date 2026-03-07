/* ═══════════════════════════════════════════════════════════════
   Destiny Profile Manager  ·  v1.0
   Deep Space & Sacred Gold — 생년월일 & 장소 기반 시차 보정 프로필
   Namespace: FORTUNE_APP_USER_PROFILES
   CustomEvent: 'destinyProfileChanged' → 사주 엔진 자동 연동
═══════════════════════════════════════════════════════════════ */
(function() {
  'use strict';

  /* ── 스토리지 키 ── */
  var NS       = 'FORTUNE_APP_USER_PROFILES';
  var KEY_LIST = NS + '.list';
  var KEY_CURR = NS + '.current';

  /* ──────────────────────────────────────────
     1. Storage Module
  ────────────────────────────────────────── */
  var DPStorage = {
    list: function() {
      try { return JSON.parse(localStorage.getItem(KEY_LIST) || '[]'); }
      catch(e) { return []; }
    },
    save: function(profiles) {
      try { localStorage.setItem(KEY_LIST, JSON.stringify(profiles)); }
      catch(e) {}
    },
    current: function() {
      try {
        var id = localStorage.getItem(KEY_CURR);
        if (!id) return null;
        return DPStorage.list().find(function(p) { return p.id === id; }) || null;
      } catch(e) { return null; }
    },
    setCurrent: function(id) {
      try { localStorage.setItem(KEY_CURR, id); } catch(e) {}
    },
    add: function(profile) {
      var list = DPStorage.list();
      profile.id = 'dp_' + Date.now();
      profile.createdAt = new Date().toISOString();
      if (list.length === 0) DPStorage.setCurrent(profile.id);
      list.push(profile);
      DPStorage.save(list);
      return profile;
    },
    remove: function(id) {
      var list = DPStorage.list().filter(function(p) { return p.id !== id; });
      DPStorage.save(list);
      if (localStorage.getItem(KEY_CURR) === id) {
        DPStorage.setCurrent(list.length ? list[0].id : '');
      }
    },
    update: function(id, patch) {
      var list = DPStorage.list().map(function(p) {
        return p.id === id ? Object.assign({}, p, patch) : p;
      });
      DPStorage.save(list);
    }
  };

  /* ──────────────────────────────────────────
     2. 진태양시(True Solar Time) 보정
        KST 기준: 표준 자오선 135도
        보정량(분) = (135 - lng) × 4
  ────────────────────────────────────────── */
  function calcTrueSolarOffset(lng, tzOffsetHours) {
    /* 표준 자오선 = UTC오프셋 × 15도 */
    var stdMeridian = (tzOffsetHours !== undefined ? tzOffsetHours : 9) * 15;
    var offsetMin = Math.round((stdMeridian - lng) * 4);
    return offsetMin;   /* 양수: 뒤로 당김, 음수: 앞으로 당김 */
  }

  function applyTrueSolarOffset(hour, minute, offsetMin) {
    var total = hour * 60 + minute - offsetMin;
    /* 자정 이전/이후 처리 */
    total = ((total % 1440) + 1440) % 1440;
    return { h: Math.floor(total / 60), m: total % 60 };
  }

  function formatTrueSolarTime(hour, minute, lng, tzOffset) {
    var offsetMin = calcTrueSolarOffset(lng, tzOffset);
    var t = applyTrueSolarOffset(hour, minute, offsetMin);
    var hh = String(t.h).padStart(2,'0');
    var mm = String(t.m).padStart(2,'0');
    var dir = offsetMin > 0 ? '-' : '+';
    var abs = Math.abs(offsetMin);
    return hh + ':' + mm + ' (' + dir + abs + '분 보정)';
  }

  /* ──────────────────────────────────────────
     3. CustomEvent 브로드캐스트
        → 사주 엔진, 자미두수, 숙요점 자동 연동
  ────────────────────────────────────────── */
  function broadcastProfileChange(profile) {
    try {
      document.dispatchEvent(new CustomEvent('destinyProfileChanged', {
        detail: { profile: profile },
        bubbles: true
      }));
    } catch(e) {}
  }

  /* ──────────────────────────────────────────
     4. 입력 폼 → 프로필 오브젝트 변환
  ────────────────────────────────────────── */
  function readFormData() {
    var name    = (document.getElementById('nameInput') || {}).value || '';
    var bdEl    = document.getElementById('birthDate');
    var bd      = bdEl ? bdEl.value : '';
    var hour    = parseInt((document.getElementById('birthHour') || {}).value) || 12;
    var minute  = parseInt((document.getElementById('birthMinute') || {}).value) || 0;
    var gender  = window._gender || 'F';

    /* calType */
    var calType = 'solar';
    var calBtns = document.querySelectorAll('input[name="calType"]');
    for (var i = 0; i < calBtns.length; i++) {
      if (calBtns[i].checked) { calType = calBtns[i].value; break; }
    }

    /* 장소 */
    var countrySel = document.getElementById('birthCountry');
    var opt        = countrySel ? countrySel.options[countrySel.selectedIndex] : null;
    var tz   = opt ? countrySel.value   : 'Asia/Seoul';
    var lng  = opt ? parseFloat(opt.getAttribute('data-long') || '127') : 127.0;
    var lat  = opt ? parseFloat(opt.getAttribute('data-lat')  || '37.6'): 37.6;
    var tzOff= opt ? parseFloat(opt.getAttribute('data-tz')   || '9')   : 9;
    var locationLabel = opt ? opt.text : '대한민국 (서울)';

    if (!name || !bd) return null;

    var parts  = bd.split('-');
    var year   = parseInt(parts[0]), month = parseInt(parts[1]), day = parseInt(parts[2]);

    return {
      name: name,
      birth: { year: year, month: month, day: day, hour: hour, minute: minute, calType: calType },
      location: { label: locationLabel, tz: tz, lng: lng, lat: lat, tzOffset: tzOff }
    };
  }

  /* ──────────────────────────────────────────
     5. UI — Master Destiny Card (상단 카드)
  ────────────────────────────────────────── */
  function renderMasterCard(profile) {
    var el = document.getElementById('dpMasterCard');
    if (!el) return;

    if (!profile) {
      el.innerHTML = _emptyCard();
      el.className = 'dp-master-card dp-master-card--empty';
      return;
    }

    var b = profile.birth;
    var l = profile.location;
    var tso = calcTrueSolarOffset(l.lng, l.tzOffset);
    var corrected = applyTrueSolarOffset(b.hour, b.minute, tso);
    var trueSolarStr = String(corrected.h).padStart(2,'0') + ':' + String(corrected.m).padStart(2,'0');
    var dir = tso > 0 ? '−' : '+';
    var absMin = Math.abs(tso);
    var zodiacEmoji = _zodiacEmoji(b.year);
    var calLabel = b.calType === 'solar' ? '양력' : (b.calType === 'lunar_leap' ? '음력(윤)' : '음력');

    el.className = 'dp-master-card dp-master-card--active';
    el.innerHTML =
      '<div class="dp-mc-glow"></div>'
      + '<div class="dp-mc-stars" aria-hidden="true"></div>'
      + '<div class="dp-mc-inner">'
        + '<div class="dp-mc-top">'
          + '<div class="dp-mc-avatar">' + zodiacEmoji + '</div>'
          + '<div class="dp-mc-identity">'
            + '<div class="dp-mc-name">' + _esc(profile.name) + '</div>'
            + '<div class="dp-mc-subtitle">' + calLabel + ' '
              + b.year + '년 ' + b.month + '월 ' + b.day + '일 '
              + String(b.hour).padStart(2,'0') + ':' + String(b.minute).padStart(2,'0')
            + '</div>'
          + '</div>'
          + '<button class="dp-mc-list-btn" onclick="dpOpenList()" aria-label="프로필 목록">'
            + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
          + '</button>'
        + '</div>'
        + '<div class="dp-mc-divider"></div>'
        + '<div class="dp-mc-info">'
          + '<div class="dp-mc-info-item">'
            + '<span class="dp-mc-info-label">출생지</span>'
            + '<span class="dp-mc-info-val">' + _esc(l.label) + '</span>'
          + '</div>'
          + '<div class="dp-mc-info-item">'
            + '<span class="dp-mc-info-label">진태양시</span>'
            + '<span class="dp-mc-info-val dp-mc-solar">'
              + trueSolarStr
              + '<span class="dp-mc-correction">' + dir + absMin + '분</span>'
            + '</span>'
          + '</div>'
          + '<div class="dp-mc-info-item">'
            + '<span class="dp-mc-info-label">경도</span>'
            + '<span class="dp-mc-info-val">' + l.lng.toFixed(1) + '°</span>'
          + '</div>'
        + '</div>'
        + '<button class="dp-mc-load-btn" onclick="dpLoadProfile()" touch-action="manipulation">'
          + '✦ 이 프로필로 운세 보기'
        + '</button>'
      + '</div>';
  }

  function _emptyCard() {
    return '<div class="dp-mc-empty-inner" onclick="dpScrollToForm()">'
      + '<div class="dp-mc-empty-icon">✦</div>'
      + '<div class="dp-mc-empty-title">나의 운명 카드</div>'
      + '<div class="dp-mc-empty-desc">아래 정보를 입력하고 저장하면<br>이곳에 나타납니다</div>'
      + '<div class="dp-mc-empty-hint">↓ 입력하러 가기</div>'
    + '</div>';
  }

  function _zodiacEmoji(year) {
    var animals = ['🐀','🐂','🐅','🐇','🐉','🐍','🐎','🐑','🐒','🐓','🐕','🐖'];
    return animals[(year - 4 + 120) % 12];
  }
  function _esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  /* ──────────────────────────────────────────
     6. UI — Profile Constellation List (바텀 시트)
  ────────────────────────────────────────── */
  function renderProfileList() {
    var list = DPStorage.list();
    var currId = (DPStorage.current() || {}).id;
    var container = document.getElementById('dpListInner');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = '<div class="dp-list-empty">아직 저장된 프로필이 없습니다.<br><small>아래 폼을 입력 후 \'저장\' 버튼을 누르세요.</small></div>';
      return;
    }

    container.innerHTML = list.map(function(p, idx) {
      var isActive = p.id === currId;
      var b = p.birth;
      var l = p.location;
      var tso = calcTrueSolarOffset(l.lng, l.tzOffset);
      var corrected = applyTrueSolarOffset(b.hour, b.minute, tso);
      var tsStr = String(corrected.h).padStart(2,'0') + ':' + String(corrected.m).padStart(2,'0');
      var zodiac = _zodiacEmoji(b.year);
      var calLabel = b.calType === 'solar' ? '양' : (b.calType === 'lunar_leap' ? '윤' : '음');
      return '<div class="dp-list-item' + (isActive ? ' dp-list-item--active' : '') + '"'
        + ' style="animation-delay:' + (idx * 0.07) + 's"'
        + ' onclick="dpSelectProfile(\'' + p.id + '\')">'
        + '<div class="dp-li-left">'
          + '<div class="dp-li-avatar">' + zodiac + '</div>'
          + '<div class="dp-li-body">'
            + '<div class="dp-li-name">' + _esc(p.name)
              + (isActive ? ' <span class="dp-li-current-badge">현재</span>' : '')
            + '</div>'
            + '<div class="dp-li-meta">[' + calLabel + '] ' + b.year + '.' + b.month + '.' + b.day
              + ' · 진태양시 ' + tsStr + '</div>'
            + '<div class="dp-li-loc">📍 ' + _esc(l.label) + '</div>'
          + '</div>'
        + '</div>'
        + '<button class="dp-li-del" onclick="event.stopPropagation();dpDeleteProfile(\'' + p.id + '\')" aria-label="삭제">✕</button>'
      + '</div>';
    }).join('');
  }

  /* ──────────────────────────────────────────
     7. 스타더스트(Stardust) 파티클 효과
  ────────────────────────────────────────── */
  function spawnStardust(el) {
    if (!el) return;
    var rect = el.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top  + rect.height / 2;
    for (var i = 0; i < 12; i++) {
      var dot = document.createElement('div');
      dot.className = 'dp-stardust';
      var angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5;
      var dist  = 30 + Math.random() * 50;
      var tx = Math.cos(angle) * dist;
      var ty = Math.sin(angle) * dist;
      dot.style.cssText = 'left:' + cx + 'px;top:' + cy + 'px;'
        + '--tx:' + tx.toFixed(1) + 'px;--ty:' + ty.toFixed(1) + 'px;';
      document.body.appendChild(dot);
      setTimeout(function(d) { if (d.parentNode) d.parentNode.removeChild(d); }, 900, dot);
    }
  }

  /* ──────────────────────────────────────────
     8. 공개 API (window.dp*)
  ────────────────────────────────────────── */
  window.dpSaveProfile = function() {
    var data = readFormData();
    if (!data) {
      alert('이름과 생년월일을 입력해주세요.');
      return;
    }
    /* 동명 동일 날짜 중복 방지 */
    var existing = DPStorage.list().find(function(p) {
      return p.name === data.name
        && p.birth.year === data.birth.year
        && p.birth.month === data.birth.month
        && p.birth.day === data.birth.day;
    });
    if (existing) {
      if (!confirm('"' + data.name + '"의 동일 날짜 프로필이 있습니다. 덮어쓸까요?')) return;
      DPStorage.remove(existing.id);
    }
    var saved = DPStorage.add(data);
    DPStorage.setCurrent(saved.id);
    spawnStardust(document.getElementById('dpSaveBtn'));
    renderMasterCard(DPStorage.current());
    renderProfileList();
    broadcastProfileChange(saved);
    _toast('✦ 프로필이 저장되었습니다', 'success');
  };

  window.dpOpenList = function() {
    renderProfileList();
    var sheet = document.getElementById('dpListSheet');
    var overlay = document.getElementById('dpListOverlay');
    if (sheet) {
      sheet.classList.add('dp-sheet--open');
      if (overlay) overlay.classList.add('dp-sheet--open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.dpCloseList = function() {
    var sheet = document.getElementById('dpListSheet');
    var overlay = document.getElementById('dpListOverlay');
    if (sheet) {
      sheet.classList.remove('dp-sheet--open');
      if (overlay) overlay.classList.remove('dp-sheet--open');
      document.body.style.overflow = '';
    }
  };

  window.dpSelectProfile = function(id) {
    DPStorage.setCurrent(id);
    var p = DPStorage.current();
    renderMasterCard(p);
    broadcastProfileChange(p);
    dpCloseList();
    spawnStardust(document.getElementById('dpMasterCard'));
    _toast('✦ ' + (p ? p.name : '') + ' 프로필 활성화', 'success');
  };

  window.dpDeleteProfile = function(id) {
    var p = DPStorage.list().find(function(x) { return x.id === id; });
    if (!p) return;
    if (!confirm('"' + p.name + '" 프로필을 삭제할까요?')) return;
    DPStorage.remove(id);
    renderProfileList();
    renderMasterCard(DPStorage.current());
    broadcastProfileChange(DPStorage.current());
  };

  window.dpLoadProfile = function() {
    var p = DPStorage.current();
    if (!p) return;
    var b = p.birth;
    var l = p.location;

    /* 폼에 값 채우기 */
    var nameEl = document.getElementById('nameInput');
    if (nameEl) nameEl.value = p.name;

    var bdEl = document.getElementById('birthDate');
    if (bdEl) {
      bdEl.value = b.year + '-' + String(b.month).padStart(2,'0') + '-' + String(b.day).padStart(2,'0');
    }

    /* calType */
    var calBtns = document.querySelectorAll('input[name="calType"]');
    calBtns.forEach(function(btn) { btn.checked = btn.value === b.calType; });

    /* 시간 */
    var hourEl = document.getElementById('birthHour');
    var minEl  = document.getElementById('birthMinute');
    if (hourEl) hourEl.value   = b.hour;
    if (minEl)  minEl.value    = b.minute;

    /* 장소 */
    var countrySel = document.getElementById('birthCountry');
    if (countrySel && l.tz) {
      for (var i = 0; i < countrySel.options.length; i++) {
        var opt = countrySel.options[i];
        if (opt.value === l.tz && Math.abs(parseFloat(opt.getAttribute('data-long') || 0) - l.lng) < 1) {
          countrySel.selectedIndex = i;
          break;
        }
      }
    }

    /* 성별 */
    if (window.setGender) window.setGender(p.gender || 'F');

    /* 루나 미리보기 갱신 */
    if (window.updateLunarPreview) window.updateLunarPreview('birthDate','calType','lunarPreview');
    if (window.updateCorrectedTimePreview) window.updateCorrectedTimePreview();

    spawnStardust(document.getElementById('dpMasterCard'));
    _toast('✦ 폼에 불러왔습니다', 'info');
  };

  window.dpScrollToForm = function() {
    var el = document.querySelector('.input-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ──────────────────────────────────────────
     9. 토스트
  ────────────────────────────────────────── */
  function _toast(msg, type) {
    var t = document.createElement('div');
    t.className = 'dp-toast dp-toast--' + (type || 'info');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function() { t.classList.add('dp-toast--show'); });
    setTimeout(function() {
      t.classList.remove('dp-toast--show');
      setTimeout(function() { if(t.parentNode) t.parentNode.removeChild(t); }, 400);
    }, 2400);
  }

  /* ──────────────────────────────────────────
     10. 초기화
  ────────────────────────────────────────── */
  function init() {
    renderMasterCard(DPStorage.current());

    /* ESC 키로 시트 닫기 */
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') dpCloseList();
    });

    /* 오버레이 클릭으로 시트 닫기 */
    var overlay = document.getElementById('dpListOverlay');
    if (overlay) overlay.addEventListener('click', dpCloseList);

    /* 폼 변경 시 카드 자동 갱신 (저장 전이라도 장소는 반영) */
    ['birthCountry'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('change', function() {
        /* 현재 프로필이 있을 때만 리렌더 */
        if (DPStorage.current()) renderMasterCard(DPStorage.current());
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* 외부 노출 */
  window.DestinyProfileManager = { storage: DPStorage, calcTrueSolarOffset: calcTrueSolarOffset };

})();
