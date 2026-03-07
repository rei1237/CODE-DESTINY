/* ─── 주역 메인 대시보드 모달 ─── */
function openJuyukModal() {
  var overlay = document.getElementById('juyukModalOverlay');
  if (!overlay) return;
  if (typeof tcReset === 'function') tcReset();
  // bottom-sheet: 시트 스크롤 완전 저위
  var sheet = document.getElementById('juyukModalSheet');
  if (sheet) sheet.scrollTop = 0;
  overlay.style.display = 'flex'; // flex: align-items:flex-end 적용
  overlay.style.animation = 'fadeIn 0.3s ease-out';
  document.body.style.overflow = 'hidden';
  setTimeout(function() {
    var inp = document.getElementById('ichingQuestion');
    if (inp) inp.focus();
  }, 350);
}

function closeJuyukModal() {
  var overlay = document.getElementById('juyukModalOverlay');
  if (overlay) overlay.style.display = 'none';
  document.body.style.overflow = '';
}

/* ESC 키로 모달 닫기 */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeJuyukModal();
});
/* 오버레이 배경 클릭 시 닫기 */
document.addEventListener('DOMContentLoaded', function() {
  var ov = document.getElementById('juyukModalOverlay');
  if (ov) ov.addEventListener('click', function(e) {
    if (e.target === ov) closeJuyukModal();
  });
});

