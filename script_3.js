
        function _resetTarotUI() {
          document.getElementById('tarotResultContainer').style.display = 'none';
          document.getElementById('tarotCardEl').classList.remove('flipped');
          document.getElementById('tarotRitualMsg').innerText = '"당신의 간절한 고민을 선택해주세요..."';
          document.querySelectorAll('.oracle-cat-btn-m').forEach(btn => btn.classList.remove('active'));
          window.curTarotCat = null;
          window.isReading = false;
        }
        function openTarotModal() {
          var overlay = document.getElementById('tarotModalOverlay');
          overlay.style.display = 'block';
          document.body.style.overflow = 'hidden';
          var req = overlay.requestFullscreen || overlay.webkitRequestFullscreen || overlay.mozRequestFullScreen || overlay.msRequestFullscreen;
          if (req) {
            req.call(overlay).catch(function(e) {});
          }
        }
        function closeTarotModal() {
          var isFs = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
          if (isFs) {
            var exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
            if (exit) exit.call(document);
          } else {
            document.getElementById('tarotModalOverlay').style.display = 'none';
            document.body.style.overflow = '';
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
                document.body.style.overflow = '';
                _resetTarotUI();
              }
            }
          }
          document.addEventListener('fullscreenchange', onFsChange);
          document.addEventListener('webkitfullscreenchange', onFsChange);
          document.addEventListener('mozfullscreenchange', onFsChange);
          document.addEventListener('MSFullscreenChange', onFsChange);
        })();
      