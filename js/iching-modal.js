/* ─── 주역 전체화면 페이지 ─── */
function openJuyukModal() {
  var overlay = document.getElementById('juyukModalOverlay');
  if (!overlay) return;
  if (typeof tcReset === 'function') tcReset();
  /* overlay가 스크롤 컨테이너이므로 overlay.scrollTop 리셋 */
  overlay.scrollTop = 0;
  /* iOS Safari 배경 스크롤 완전 차단 */
  if (window._perf && window._perf.lockBody) { window._perf.lockBody(); }
  else { document.body.style.overflow = 'hidden'; }
  overlay.style.display = 'block';
  setTimeout(function() {
    var inp = document.getElementById('ichingQuestion');
    if (inp) inp.focus();
  }, 380);
}

function closeJuyukModal() {
  var overlay = document.getElementById('juyukModalOverlay');
  if (overlay) overlay.style.display = 'none';
  /* body 스크롤 복원 */
  if (window._perf && window._perf.unlockBody) { window._perf.unlockBody(); }
  else { document.body.style.overflow = ''; }
  /* 홈(메인 화면)으로 돌아갈 때 거북점 섹션이 보이도록 부드럽게 스크롤 */
  var iChingSection = document.getElementById('tabIching') || document.querySelector('[data-section="iching"]');
  if (iChingSection) {
    setTimeout(function() {
      iChingSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
}

/* ESC 키로 닫기 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeJuyukModal();
});

